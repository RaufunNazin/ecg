import { createGlobalState } from "react-hooks-global-state";
const userState = {
  isLoggedIn: false,
  jwt: "",
  user: {
    id: null,
    name: "",
    phone: "",
    role: "",
  },
};

const { useGlobalState } = createGlobalState(userState);
export { useGlobalState };
