import React from "react";
import ReactDOM from "react-dom";
import pDefer from "p-defer";
import useForkRef from "@material-ui/utils/useForkRef";
import useEventCallback from "@material-ui/utils/useEventCallback";

let userMediaStream;

function requestUserMedia() {
	if (userMediaStream) {
		return userMediaStream.promise;
	}

	userMediaStream = pDefer();

	navigator.mediaDevices
		.getUserMedia({
			video: {
				width: 320,
				height: 240,
			},
			audio: false,
		})
		.then(userMediaStream.resolve)
		.catch(userMediaStream.reject);

	return userMediaStream.promise;
}

let userDisplayStream;
function requestDisplay() {
	if (userDisplayStream) {
		return userDisplayStream.promise;
	}

	userDisplayStream = pDefer();

	navigator.mediaDevices
		.getDisplayMedia({
			video: {
				width: 320,
				height: 240,
			},
			audio: false,
		})
		.then(userDisplayStream.resolve)
		.catch(userDisplayStream.reject);

	return userDisplayStream.promise;
}

function App() {
	const userMediaRef = React.useRef();
	let handleUserMediaRef = useMedia(requestUserMedia, userMediaRef);

	const userDisplayRef = React.useRef();
	let handleUserDisplayRef = useMedia(requestDisplay, userDisplayRef);

	return (
		<div className="App">
			<h1>User Media</h1>
			<video ref={handleUserMediaRef} />
			<h1>User Display</h1>
			<video ref={handleUserDisplayRef} />
		</div>
	);
}

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);

function useMedia(mediaProvider, userMediaRef) {
	let handleUserMediaRef = useEventCallback(async (ref) => {
		if (!ref) {
			return;
		}

		const stream = await mediaProvider();
		ref.srcObject = stream;

		ref.addEventListener("loadedmetadata", () => {
			ref.play();
		});
	});
	handleUserMediaRef = useForkRef(userMediaRef, handleUserMediaRef);
	return handleUserMediaRef;
}
