# Backend API Specification

This document summarizes every HTTP endpoint that the React + TypeScript storefront currently calls through the shared `axios` client (`src/utils/request.ts`). All endpoints are expected to be hosted under the base URL:

- **Base URL:** `https://8.148.246.5/api`
- **Authentication:** When a user is logged in, the frontend adds an `Authorization: Bearer <token>` header to every request via an axios interceptor. Unless stated otherwise, endpoints should return `401 Unauthorized` if the token is missing or invalid.

Data models referenced below align with the TypeScript interfaces located in `src/types`.

---

## Authentication & User Management

### `POST /login`
- **Purpose:** Authenticate a customer and issue an access token.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
  > ℹ️ The current frontend implementation invokes `request.post('/login', { params: { username, password } })`, which serializes the payload as `{ "params": { ... } }`. Ideally, the backend should accept the simplified body above, and the frontend will be refactored accordingly.
- **Success Response:**
  ```json
  {
    "user": {
      "username": "string"
    },
    "token": "string"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` – Missing credentials.
  - `401 Unauthorized` – Credentials invalid.
  - `429 Too Many Requests` – Optional throttling.

### `POST /logout`
- **Purpose:** Invalidate the active session/token (server-side logout) and clear any related refresh artifacts.
- **Request Body:** _None._
- **Success Response:**
  - `204 No Content` (preferred) or `{ "success": true }`.
- **Error Responses:**
  - `401 Unauthorized` – Token missing/expired.

### `POST /api/register`
- **Purpose:** Register a new customer account.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
  > ⚠️ With the current axios base URL (`/api`), the frontend calls `POST /api/register`, which resolves to `/api/api/register`. Two options: (1) expose the backend endpoint at `/api/register`, or (2) adjust the frontend call to `/register`. Documented here to keep behaviour predictable.
- **Success Response:** `201 Created` with either `{ "success": true }` or the newly created user document.
- **Error Responses:**
  - `400 Bad Request` – Validation failure (e.g., weak password).
  - `409 Conflict` – Username already exists.

---

## Product Catalog

### `GET /products`
- **Purpose:** Fetch a paginated list of products for the storefront.
- **Query Parameters:**
  - `page` (number, required) – 1-indexed current page. Frontend will request `1`, `currentPage ± 1`, or `totalPages`.
  - `limit` (number, required) – Page size. Frontend default is `8` and is stored in Redux state.
- **Success Response:**
  ```json
  {
    "products": [
      {
        "id": "string",
        "name": "string",
        "price": 0,
        "category": "string",
        "imageUrl": "/media/products/example.jpg"
      }
    ],
    "currentPage": 1,
    "totalPages": 5
  }
  ```
  - `products` should return an empty array when no more data is available.
- **Error Responses:**
  - `400 Bad Request` – Invalid query parameters.
  - `404 Not Found` – Page exceeds available range.

### `GET /products/{productId}`
- **Purpose:** Retrieve the full details for a single product page.
- **Path Parameters:**
  - `productId` (string) – Unique product identifier.
- **Success Response:**
  ```json
  {
    "id": "string",
    "name": "string",
    "price": 0,
    "category": "string",
    "description": "string",
    "stock": 0,
    "Images": [
      "/media/products/example-1.jpg",
      "/media/products/example-2.jpg"
    ]
  }
  ```
  - `Images` order will be rendered inside an Ant Design carousel.
  - Image assets live on the backend host; always return paths relative to the API domain so the frontend can compose `baseURL + relativePath`.
- **Error Responses:**
  - `404 Not Found` – Product does not exist.

---

## Shopping Cart

Cart endpoints operate on a per-user cart keyed by the authenticated token. All responses should reflect the latest cart state to keep the UI consistent.

### Data Structures
- **CartItem**
  ```json
  {
    "id": "string",
    "name": "string",
    "price": 0,
    "category": "string",
    "imageUrl": "/media/products/example-thumb.jpg",
    "quantity": 0
  }
  ```
- **CartState**
  ```json
  {
    "items": [CartItem, ...],
    "totalPrice": 0,
    "totalQuantity": 0
  }
  ```

### `GET /cart`
- **Purpose:** Load the entire cart when the user enters the cart screen or refreshes the page.
- **Request Body:** _None._
- **Success Response:** `CartState` object.
- **Error Responses:**
  - `401 Unauthorized` – User not logged in.

### `POST /cart/add`
- **Purpose:** Add one unit of a product to the cart (or increment an existing line item).
- **Request Body:**
  ```json
  {
    "id": "string"
  }
  ```
- **Success Response:** Updated `CartItem` for the product after incrementing.
- **Error Responses:**
  - `400 Bad Request` – Unknown product ID or out-of-stock.
  - `409 Conflict` – Inventory constraint (optional).

### `POST /cart/minus`
- **Purpose:** Remove one unit of a product from the cart (minimum quantity enforced on the frontend).
- **Request Body:** Same as `/cart/add`.
- **Success Response:** Updated `CartItem` reflecting the new quantity. Quantity may drop to zero; frontend will hide the “-” button at zero.

### `POST /cart/remove`
- **Purpose:** Remove the product line entirely, regardless of quantity.
- **Request Body:** Same as `/cart/add`.
- **Success Response:** Updated `CartItem` (optionally include a `removed: true` flag) so the frontend can confirm removal.

### `POST /cart/setQuantity`
- **Purpose:** Set the product quantity to an explicit number (used by admin/quantity input flows).
- **Request Body:**
  ```json
  {
    "id": "string",
    "quantity": 0
  }
  ```
- **Success Response:** Recommended to return the full `CartState` or the updated `CartItem`. The current frontend ignores the body, so `204 No Content` is acceptable.
- **Validation:**
  - Reject negative quantities with `400 Bad Request`.
  - Optional: enforce stock limits with `409 Conflict`.

### `POST /cart/clear`
- **Purpose:** Empty the cart.
- **Request Body:** _None._
- **Success Response:**
  - `204 No Content`, or `{ "items": [], "totalPrice": 0, "totalQuantity": 0 }`.

---

## Error Handling & Conventions
- Use standard HTTP status codes and JSON error payloads (`{ "error": "message" }`).
- Timeouts: The frontend expects responses within 5 seconds.
- CORS: Ensure the domain hosting the React app is allowed to call the API with credentials.
- Pagination defaults should stay consistent; changing page size requires a coordinated frontend update.
- Consider adding structured error codes so the UI can display specific messages (e.g., inventory shortage, duplicate username).

---

## Open Questions & Follow-ups
1. **Register endpoint path:** Confirm whether to expose `/api/register` or harmonize on `/register` and update the frontend call.
2. **Login payload shape:** Decide if the backend will accept the current `{ "params": { ... } }` payload or if we should refactor the frontend to send a flat JSON body.
3. **Cart item pricing:** Clarify whether `CartItem.price` represents unit price (current assumption) or subtotal per item. Frontend treats it as unit price.
4. **Token invalidation:** If server-side session invalidation is required, define the logout behaviour (e.g., revoke refresh tokens).

Once these decisions are finalized, we can update the frontend if needed and keep this document as the authoritative contract for backend development.
