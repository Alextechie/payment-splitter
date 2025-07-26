import { Router } from "express";
import { allRuleGroups, createGroup, getRuleGroupById, updatesRuleGroup } from "../controllers/rule-group.controller";

const router = Router();

router.post("/create-group", createGroup);
router.get("/all", allRuleGroups);
router.get("/:id", getRuleGroupById);
router.put("/:id", updatesRuleGroup);


export const ruleGroupRoutes = router;