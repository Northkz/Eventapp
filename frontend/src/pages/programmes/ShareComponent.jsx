import React from "react";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { solid, regular, brands } from "@fortawesome/fontawesome-svg-core/import.macro";

const ShareComponent = ({ content }) => {
  var shareUrl = "";
  if (typeof window === "object") {
    shareUrl = String(window.location);
  }
  const title = content;

  return (
    <div>
      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  );
};

export default ShareComponent;
