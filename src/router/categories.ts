import { GenericController} from "../controller/GenericController";
import { Categories } from "../entity/Categories";
import { _makeGenericRouter } from "./_makeRouter";

export interface ICatBody {
  name: string;
}
interface ICatBodyPatch {
  name?: string;
}

const catController = new GenericController<
  Categories,
  ICatBody,
  ICatBodyPatch
>(Categories, "categories");

export default _makeGenericRouter<Categories, ICatBody, ICatBodyPatch>(
  catController
);
