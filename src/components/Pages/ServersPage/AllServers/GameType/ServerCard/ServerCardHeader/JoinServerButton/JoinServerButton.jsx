import { isMobile } from "@/lib/validation";
import s from "./JoinServerButton.module.scss";

const isMobileDevice = isMobile();

const JoinServerButton = ({ server }) => {
  if (isMobileDevice || !server.GameType.includes("COD")) {
    return;
  }

  const game = server.GameType.toLowerCase();
  const serverAddress = `${server.IP}:${server.Port}`;

  return (
    <a
      className={`${s.joinServerButton} ${s[game]}`}
      href={`${game}x://%2Bconnect%20${serverAddress}`}
      title={`Connect to ${serverAddress}`}
      aria-label={`Join Server at ${serverAddress}`}
    >
      Join Server
    </a>
  );
};
export default JoinServerButton;
