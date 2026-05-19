import { isMobile } from "@/lib/validation";
import { useEffect, useRef } from "react";
import s from "./JoinServerButton.module.scss";

const isMobileDevice = isMobile();
const BLUR_TIMEOUT_MS = 1500;

const JoinServerButton = ({ server }) => {
  const pageBlurredRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isMobileDevice || !server.GameType.includes("COD")) {
    return null;
  }

  const game = server.GameType.toLowerCase();
  const serverAddress = `${server.IP}:${server.Port}`;
  const protocolUrl =
    game === "cod2"
      ? `cod2x://%2Bconnect%20${serverAddress}`
      : `cod4://${serverAddress}`;

  function handleJoinClick(event) {
    event.preventDefault();
    pageBlurredRef.current = false;

    function handleBlur() {
      pageBlurredRef.current = true;
    }

    window.addEventListener("blur", handleBlur);
    window.location.href = protocolUrl;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if the browser lost focus after 1.5s. If it didn't, the protocol handler is missing.
    timeoutRef.current = setTimeout(() => {
      window.removeEventListener("blur", handleBlur);

      const gameInstalled = pageBlurredRef.current;

      if (!gameInstalled) {
        alert(
          `It looks like you don't have ${game}x installed. Please download it to be able to join the server. (Might not be accurate, we are working on it.)`,
        );
      }
    }, BLUR_TIMEOUT_MS);
  }

  return (
    <a
      className={`${s.joinServerButton} ${s[game]}`}
      href={protocolUrl}
      onClick={handleJoinClick}
      title={`Connect to ${serverAddress}`}
      aria-label={`Join Server at ${serverAddress}`}
    >
      Join Server
    </a>
  );
};

export default JoinServerButton;
