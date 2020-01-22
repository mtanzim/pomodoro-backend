import { GenericController, WithId} from "../controller/GenericController";
import { Categories } from "../entity/Categories";
import { _makeGenericRouter } from "./_makeRouter";

export interface ICatBody extends WithId {
  // userId: number;
  name: string;
}
interface ICatBodyPatch extends WithId {
  name?: string;
}

const catController = new GenericController<
  Categories,
  ICatBody,
  ICatBodyPatch
>(Categories);

export default _makeGenericRouter<Categories, ICatBody, ICatBodyPatch>(
  catController
);
