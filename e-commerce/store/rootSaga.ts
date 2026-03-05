import { all, fork } from "redux-saga/effects";
import { authSaga } from "./login/saga";
import { addProSaga } from "./addpro/saga";
import { orderSaga } from "./order/saga";
import { feedbackSaga } from "./feedback/saga";
import wishlistSaga from "./wishlist/saga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(addProSaga),
    fork(orderSaga),
    fork(feedbackSaga),
    fork(wishlistSaga),
  ]);
}
