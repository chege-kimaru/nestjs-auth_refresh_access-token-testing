import { message, danger, fail, warn } from "danger"

const modified_files = danger.git.modified_files.join("- ")
message("Changed Files in this MR: \n - " + modified_files)

const title_regex = /^\#[a-zA-Z0-9]{7}/g
const cu_branch_regex = /^(.*)\/CU-[a-z0-9]{7}(.*)/g
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
        const has_cu_id =
            danger.gitlab.mr.title.match(title_regex) ||
            danger.gitlab.mr.source_branch.match(cu_branch_regex);

        if (!has_cu_id) {
            // @see https://docs.clickup.com/en/articles/2221930-gitlab
            fail("Develop only: Clickup task id must be in MR title or in branch name in one of the formats: #{task_id}, CU-{task_id}")
        }
    }
}
