import { faker } from "@faker-js/faker";

import { IProject } from "@/components/modules/dashboard/projects/columns";

export const generateProjects = (count: number): IProject[] => {
    const projects: IProject[] = [];

    for (let i = 0; i < count; i++) {
        const project: IProject = {
            _id: faker.string.uuid(),
            title: faker.lorem.words(3),
            status: faker.helpers.arrayElement(["draft", "published"]),
            created_at: faker.date.past(),
        };

        projects.push(project);
    }

    return projects;
};
