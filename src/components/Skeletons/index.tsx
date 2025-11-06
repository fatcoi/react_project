import { Skeleton } from "antd";

const Skeletons = () => {
    return (
        <Skeleton.Node active style={{ height: 420, width: '100%' }}>
            <div></div>
        </Skeleton.Node>
    )
}

export default Skeletons;