
import { createClient ,  createMicrophoneAndCameraTracks} from "agora-rtc-react";




const appId = "4e719eb97a564dcda1b741cdf8170c5a"


export const config = {mode:"rtc",codec: "vp8",appId : appId};
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
