import { message, danger, fail, warn } from "danger"

const modified_files = danger.git.modified_files.join("- ")
message("Changed Files in this MR: \n - " + modified_files)

const title_regex = /^\#[a-zA-Z0-9]{7}/g
const cu_branch_regex = /^(.*)\/CU-[a-z0-9]{7}_(.*)/g
const force_regex = /\bCU-FORCE\b/g;
const develop_branch_regex = /^develop/g;

const is_force = danger.gitlab.mr.title.match(force_regex);
const is_develop = danger.gitlab.mr.target_branch.match(develop_branch_regex);

if (!is_force) {
    if (!(danger.gitlab.mr.assignee && danger.gitlab.mr.assignee.username)) {
        fail("Assignee is required")
    }
    if (!danger.gitlab.approvals.approved_by.length > 0) {
        warn("At least one approver is required")
    }
    if (!danger.gitlab.mr.reviewers.length > 0) {
        fail("At least one reviewer is required")
    }
    if (is_develop) {
        if (!danger.gitlab.mr.squash) {
            fail("Develop only: \"Squash commits\" setting must be enabled")
        }
        if (!danger.gitlab.mr.title.match(title_regex)) {
            fail("Develop only: The title of the merge request must start with the Clickup task ID, format #1234567")
        }
        if (!danger.gitlab.mr.source_branch.match(cu_branch_regex)) {
            fail("Develop only: The source branch must be in the Clickup, format user/CU-1234567_Task-Description")
        }
    }
}
