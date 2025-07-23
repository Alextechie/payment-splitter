import { Router } from "express";
import * as recipientController from "./recipient.controller"

const router = Router();

router.post("/create", recipientController.create);
router.get("/", recipientController.getAll);
router.get("/:id", recipientController.getById);
router.put("/:id", recipientController.update);
router.delete("/:id", recipientController.remove);


export const recipientRoutes = router;