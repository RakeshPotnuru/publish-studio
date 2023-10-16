import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

const projects = Array.from({ length: 100 }, () => ({
    _id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(["draft", "published", "scheduled"]),
    created: faker.date.past(),
    last_edited: faker.date.past(),
}));

fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(projects, null, 2));

console.log("✅ Projects data generated.");

const folders = Array.from({ length: 100 }, () => ({
    _id: faker.string.uuid(),
    name: faker.lorem.words(3),
}));

fs.writeFileSync(path.join(__dirname, "folders.json"), JSON.stringify(folders, null, 2));

console.log("✅ Folders data generated.");

const extensions = ["jpg", "png", "gif", "svg", "jpeg"];
const assets = Array.from({ length: 100 }, () => ({
    _id: faker.string.uuid(),
    original_file_name: faker.system.commonFileName(
        extensions[(Math.random() * extensions.length) | 0],
    ),
    hosted_url: faker.image.url(),
    created: faker.date.past(),
    last_edited: faker.date.past(),
}));

fs.writeFileSync(path.join(__dirname, "assets.json"), JSON.stringify(assets, null, 2));

console.log("✅ Assets data generated.");
