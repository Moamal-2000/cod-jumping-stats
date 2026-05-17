import { isMobile } from "@/lib/validation";
import s from "./JoinServerButton.module.scss";

const isMobileDevice = isMobile();

const JoinServerButton = ({ server }) => {
  if (isMobileDevice) {
    return;
  }

  const game = server.GameType === "COD4" ? "cod4" : "cod2x";
  const serverAddress = `${server.IP}:${server.Port}`;

  return (
    <a
      href={`${game}://%2Bconnect%20${serverAddress}`}
      title={`Connect to ${serverAddress}`}
      aria-label={`Join Server at ${serverAddress}`}
      className={`${s.joinServerButton} ${s[server.GameType.toLowerCase()]}`}
    >
      Join Server
    </a>
  );
};
export default JoinServerButton;
