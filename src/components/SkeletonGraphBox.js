import '../css/SkeletonGraphBox.css';

export default function SkeletonGraphBox() {
    return (
        <div className="skeleton-graphbox">
            <div className="skeleton-graphbox__header">
                <div className="skeleton-graphbox__updatedAt skeleton-shimmer"></div>
                <div className="skeleton-graphbox__button skeleton-shimmer"></div>
                <div className="skeleton-graphbox__button skeleton-shimmer"></div>
                <div className="skeleton-graphbox__button skeleton-shimmer"></div>
                <div className="skeleton-graphbox__button skeleton-shimmer"></div>
            </div>
            <div className="skeleton-graphbox__graph">
                <div className="skeleton-graph-content">
                    <div className="skeleton-graph-bars">
                        <div className="skeleton-bar skeleton-shimmer" style={{ height: '60%', animationDelay: '0s' }}></div>
                        <div className="skeleton-bar skeleton-shimmer" style={{ height: '80%', animationDelay: '0.1s' }}></div>
                        <div className="skeleton-bar skeleton-shimmer" style={{ height: '50%', animationDelay: '0.2s' }}></div>
                        <div className="skeleton-bar skeleton-shimmer" style={{ height: '90%', animationDelay: '0.3s' }}></div>
                        <div className="skeleton-bar skeleton-shimmer" style={{ height: '70%', animationDelay: '0.4s' }}></div>
                        <div className="skeleton-bar skeleton-shimmer" style={{ height: '85%', animationDelay: '0.5s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

