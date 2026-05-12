import { isMobile } from "@/lib/validation";
import s from "./JoinServerButton.module.scss";

const isMobileDevice = isMobile();

const JoinServerButton = ({ server }) => {
  const showJoinServerLink = server.GameType === "COD2" && !isMobileDevice;

  if (!showJoinServerLink) {
    return;
  }

  const serverAddress = `${server.IP}:${server.Port}`;

  return (
    <a
      href={`cod2x://%2Bconnect%20${serverAddress}`}
      title={`Connect to ${serverAddress}`}
      aria-label={`Join Server at ${serverAddress}`}
      className={s.joinServerButton}
    >
      Join Server
    </a>
  );
};
export default JoinServerButton;
