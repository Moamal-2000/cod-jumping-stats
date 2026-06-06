import { Link } from "next-view-transitions";
import Image from "next/image";
import s from "./VideoOverlay.module.scss";

const VideoOverlay = ({ oEmbedData, channelThumbnail }) => {
  return (
    <div className={s.overlayContent}>
      <div className={s.channelInfo}>
        {channelThumbnail && (
          <div className={s.channelAvatar}>
            <Link
              href={oEmbedData.author_url}
              target="_blank"
              rel="noopener"
              title={`Visit ${oEmbedData?.author_name || "owner"}'s channel`}
            >
              <Image
                src={channelThumbnail}
                alt={oEmbedData?.author_name || "Channel"}
                width={36}
                height={36}
                className={s.channelImage}
                onError={(e) => (e.target.style.display = "none")}
              />
            </Link>
          </div>
        )}

        <span className={s.videoTitleOverlay}>{oEmbedData?.title || ""}</span>
      </div>
    </div>
  );
};

export default VideoOverlay;
