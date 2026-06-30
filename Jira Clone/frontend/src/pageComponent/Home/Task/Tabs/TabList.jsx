import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { InboxIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Dot, BookmarkIcon, Calendar, Tag } from "lucide-react";
import { capitalizeFirstLetter } from "@/utility/capitalizeFirstLetter";

export function TabList() {
  let taskLists = [
    {
      id: "64f1a2b3c4d5e6f7a8b9c0d4",
      type: "task",
      title: "Review design mockups",
      desc: "In Progress • UI Design System",
      project: "website Redesign",
      priority: "high",
      dueDate: "2026-01-22",
      assignTo: "Ujjwal Kumar",
      label: ["Design", "Development", "Bug"],
    },
    {
      id: "64f1a2b3c4d5e6f7a8b9c0d4",
      type: "task",
      title: "Review design mockups",
      desc: "In Progress • UI Design System",
      project: "website Redesign",
      priority: "high",
      dueDate: "2026-01-22",
      assignTo: "Ujjwal Kumar",
      label: ["Design", "Development", "Bug"],
    },
    {
      id: "64f1a2b3c4d5e6f7a8b9c0d4",
      type: "task",
      title: "Review design mockups",
      desc: "In Progress • UI Design System",
      project: "website Redesign",
      priority: "high",
      dueDate: "2026-01-22",
      assignTo: "Ujjwal Kumar",
      label: ["Design", "Development", "Bug"],
    },
    {
      id: "64f1a2b3c4d5e6f7a8b9c0d4",
      type: "task",
      title: "Review design mockups",
      desc: "In Progress • UI Design System",
      project: "website Redesign",
      priority: "high",
      dueDate: "2026-01-22",
      assignTo: "Ujjwal Kumar",
      label: ["Design", "Development", "Bug"],
    },
    {
      id: "64f1a2b3c4d5e6f7a8b9c0d4",
      type: "task",
      title: "Review design mockups",
      desc: "In Progress • UI Design System",
      project: "website Redesign",
      priority: "high",
      dueDate: "2026-01-22",
      assignTo: "Ujjwal Kumar",
      label: ["Design", "Development", "Bug"],
    },
  ];
  return (
    <FieldSet>
      <FieldGroup className="gap-3">
        {taskLists.map((task) => {
          return (
            <Field orientation="horizontal">
              <Item variant="outline" className="w-full hover:shadow-md transition-all duration-400">
                <ItemMedia>
                  <Checkbox
                    id="finder-pref-9k2-hard-disks-ljj-checkbox"
                    name="finder-pref-9k2-hard-disks-ljj-checkbox"
                  />
                </ItemMedia>
                <ItemContent className="flex-col gap-3">
                  <ItemTitle>{task.title}</ItemTitle>
                  <ItemDescription>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-red-100 text-red-600 py-1 px-3">
                        <Dot
                          size={64}
                          strokeWidth={9}
                          className="text-red-500"
                        />
                        {capitalizeFirstLetter(String(task.priority))}
                      </Badge>
                      <Badge variant="ghost" className="py-1 px-3">
                        <Calendar data-icon="inline-start" />
                        Verified
                      </Badge>
                      <Badge variant="outline" className="bg-indigo-100 text-indigo-600 py-1 px-3">
                        <Tag data-icon="inline-start" />
                        {capitalizeFirstLetter(String(task.label[0]))}
                      </Badge>
                      <Badge variant="ghost" className="py-1 px-3">
                        <span className="font-light">Project:</span> <span>{task.project}</span>
                      </Badge>
                    </div>
                  </ItemDescription>
                </ItemContent>
              </Item>
            </Field>
          );
        })}
      </FieldGroup>
    </FieldSet>
  );
}
