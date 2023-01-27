import { useRef } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Resize the element height based upon the rendered width to maintain
 * aspect ratio.
 * @param {MutableRefObject<HTMLElement | undefined>} elementRef - ref to the
 * element's DOM object
 * @param {number} aspectRatio - desired aspect ratio of the element
 */
export const resizeElementHeightToMaintainAspectRatio = (
  elementRef,
  aspectRatio
) => {
  if (elementRef.current && elementRef.current.clientWidth > 0) {
    elementRef.current.style.height = `${
      elementRef.current.clientWidth / aspectRatio
    }px`;
    return true;
  }

  return false;
};

function VideoPlayer(props) {
  const { src, title } = props;
  const elementRef = useRef();
  const aspectRatio = props.width / props.height;
  useEffect(
    function resizeElementAfterRender() {
      function resizeElementHandler() {
        return resizeElementHeightToMaintainAspectRatio(
          elementRef,
          aspectRatio
        );
      }

      let initialResizeAttemptCount = 0;
      const maxInitialResizeAttemptCount = 20;

      // runs after the initial render
      const handle = window.setInterval(function configureResizeElement() {
        const maxAttemptsReached =
          initialResizeAttemptCount >= maxInitialResizeAttemptCount;

        let done = maxAttemptsReached || resizeElementHandler();

        if (done) {
          // runs on every window resize
          window.addEventListener("resize", resizeElementHandler);
          window.clearInterval(handle);

          if (maxAttemptsReached) {
            console.debug(
              "video player max attempts reached to perform resize on initial render"
            );
          }

          return;
        }

        initialResizeAttemptCount++;
      }, 100 /* run as a new JS task to ensure clientWidth is set */);

      // removes resize event handler when component is unmounted
      return function cleanUpResizeElementHandler() {
        window.removeEventListener("resize", resizeElementHandler);
      };
    },
    [elementRef, aspectRatio]
  );
  return (
    <iframe
      ref={elementRef}
      width="100%"
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}

VideoPlayer.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default VideoPlayer;
