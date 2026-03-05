import { combineReducers } from "redux";
import loginReducer from "./login/reducer";
import addProReducer from "./addpro/reducer";
import orderReducer from "./order/reducer";
import buyReducer from "./buy/reducer";
import feedbackReducer from "./feedback/reducer";
import wishlistReducer from "./wishlist/reducer";

const rootReducer = combineReducers({
    login: loginReducer,
    addPro: addProReducer,
    order: orderReducer,
    feedback: feedbackReducer,
<<<<<<< Updated upstream
    wishlist: wishlistReducer,
=======
    buy: buyReducer,
>>>>>>> Stashed changes
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
