import { combineReducers } from "redux";
import loginReducer from "./login/reducer";
import addProReducer from "./addpro/reducer";
import orderReducer from "./order/reducer";

const rootReducer = combineReducers({
    login: loginReducer,
    addPro: addProReducer,
    order: orderReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
