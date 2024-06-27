import { TRPCError } from "@trpc/server";
import type { Request, Response } from "express";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app";
import { constants } from "../../config/constants";
import { ai } from "../../utils/google/gemini";
import { logtail } from "../../utils/logtail";
import Project from "../project/project.model";
import ProjectService from "../project/project.service";
import type { IProject } from "../project/project.types";

export default class GenerativeAIService extends ProjectService {
  async generateTitle(topic: string, user_id: Types.ObjectId) {
    const parts = [
      {
        text: `input: Create an SEO-optimized creative title for the blog topic "${topic}". Keep the characters' length from 50 to 60. The output should contain only a single title in plain text.`,
      },
    ];

    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          maxOutputTokens: constants.project.title.RECOMMENDED_MAX_LENGTH,
        },
      });

      const response = result.response;

      return response.text();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while generating a title. Please try again later.",
      });
    }
  }

  async generateDescription(topic: string, user_id: Types.ObjectId) {
    const parts = [
      {
        text: `Create an SEO-optimized creative description for the blog topic "${topic}". Keep the characters' length from a minimum of 120 to a maximum of 160. The output should contain only a single description in plain text.`,
      },
    ];

    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          maxOutputTokens: constants.project.description.RECOMMENDED_MAX_LENGTH,
        },
      });

      const response = result.response;

      return response.text();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while generating a description. Please try again later.",
      });
    }
  }

  async generateOutline(title: string, user_id: Types.ObjectId) {
    const parts = [
      {
        text: `Generate a markdown-based blog outline for the topic "${title}".`,
      },
    ];

    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts }],
      });

      const response = result.response;

      return response.text();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while generating an outline. Please try again later.",
      });
    }
  }

  async generateCategories(text: string, user_id: Types.ObjectId) {
    const parts = [
      {
        text: "Given a sentence, return an array of 5 categories related to that sentence",
      },
      {
        text: "sentence: Break down the steps to deploy a MERN application to AWS Elastic Beanstalk, employing Continuous Integration and Continuous Delivery (CI/CD) for seamless deployment and updates.",
      },
      {
        text: "categories: [Continuous integration,Continuous delivery,DevOps,Build automation,Release management]",
      },
      {
        text: "sentence: Explore the foundational principles of web design, from minimalist masterpieces to engaging interfaces. Understand the key components of a great website and discover how to craft user-centric online experiences.",
      },
      {
        text: "categories: [UI design,Visual design,Website design,User experience,User interface]",
      },
      {
        text: "sentence: What is Blockchain? How does it work? Why do we need it?",
      },
      {
        text: "categories: [Blockchain,Bitcoin,Ethereum,Decentralized,Smart contracts]",
      },
      {
        text: "sentence: Adding Authentication to full stack MERN web application",
      },
      {
        text: "categories: [Authentication,Authorization,Nodejs,Expressjs,MongoDB]",
      },
      { text: `sentence: ${text}` },
    ];

    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts }],
      });

      const response = result.response;

      return response.text();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while generating categories. Please try again later.",
      });
    }
  }

  async changeTone(req: Request, res: Response) {
    const { text, tone } = req.body;

    try {
      const parts = [
        {
          text: `Rewrite the following text in ${tone} tone while maintaining its original length: ${text}`,
        },
      ];

      const result = await ai.generateContentStream({
        contents: [{ role: "user", parts }],
      });

      res.writeHead(200, {
        "Content-Type": "text/plain",
        "transfer-encoding": "chunked",
      });

      for await (const chunk of result.stream) {
        res.write(chunk.text());
      }

      return res.end();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: req.user._id,
      });

      return res
        .status(500)
        .json({ status: "error", message: defaultConfig.defaultErrorMessage });
    }
  }

  async shortenText(req: Request, res: Response) {
    const { text } = req.body;

    try {
      const parts = [
        {
          text: `Condense the following passage into a brief, succinct version without losing its essence: ${text}`,
        },
      ];

      const result = await ai.generateContentStream({
        contents: [{ role: "user", parts }],
      });

      res.writeHead(200, {
        "Content-Type": "text/plain",
        "transfer-encoding": "chunked",
      });

      for await (const chunk of result.stream) {
        res.write(chunk.text());
      }

      return res.end();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: req.user._id,
      });

      return res
        .status(500)
        .json({ status: "error", message: defaultConfig.defaultErrorMessage });
    }
  }

  async expandText(req: Request, res: Response) {
    const { text } = req.body;

    try {
      const parts = [
        {
          text: `Expand the following passage without losing its essence, don't make it more than 3 times longer, and don't mention you are expanding it: ${text}`,
        },
      ];

      const result = await ai.generateContentStream({
        contents: [{ role: "user", parts }],
      });

      res.writeHead(200, {
        "Content-Type": "text/plain",
        "transfer-encoding": "chunked",
      });

      for await (const chunk of result.stream) {
        res.write(chunk.text());
      }

      return res.end();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: req.user._id,
      });

      return res
        .status(500)
        .json({ status: "error", message: defaultConfig.defaultErrorMessage });
    }
  }

  async generateNumberedList(req: Request, res: Response) {
    const { text } = req.body;

    try {
      const parts = [
        {
          text: `Generate a numbered list from the provided text, organizing the information into concise points. Don't create headings: ${text}`,
        },
      ];

      const result = await ai.generateContentStream({
        contents: [{ role: "user", parts }],
      });

      res.writeHead(200, {
        "Content-Type": "text/plain",
        "transfer-encoding": "chunked",
      });

      for await (const chunk of result.stream) {
        res.write(chunk.text());
      }

      return res.end();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: req.user._id,
      });

      return res
        .status(500)
        .json({ status: "error", message: defaultConfig.defaultErrorMessage });
    }
  }

  async generateBulletList(req: Request, res: Response) {
    const { text } = req.body;

    try {
      const parts = [
        {
          text: `Generate a bullet list from the provided text, organizing the information into concise points. Don't create headings: ${text}`,
        },
      ];

      const result = await ai.generateContentStream({
        contents: [{ role: "user", parts }],
      });

      res.writeHead(200, {
        "Content-Type": "text/plain",
        "transfer-encoding": "chunked",
      });

      for await (const chunk of result.stream) {
        res.write(chunk.text());
      }

      return res.end();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: req.user._id,
      });

      return res
        .status(500)
        .json({ status: "error", message: defaultConfig.defaultErrorMessage });
    }
  }

  async genIdeasBasedOnPastContent(user_id: Types.ObjectId) {
    const data = (await Project.aggregate([
      { $match: { user_id } },
      { $sample: { size: 10 } },
      { $project: { name: 1 } },
    ]).exec()) as Pick<IProject, "name" | "_id">[];

    if (data.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No projects found.",
      });
    }

    const parts = [
      {
        text: "Based on the content of past projects, generate 5 new blog post ideas. Each idea should be unique and creative. Don't use markdown. Output should be an array of 5 arrays where each array is a single idea. Each idea's character length MUST be between 50 to 60 characters.",
      },
      {
        text: "past ideas: What is a headless website?,Deploying a MERN App to AWS Elastic Beanstalk with CI/CD: A Comprehensive Guide,Streamline MERN App Deployment: A guide to AWS Elastic Beanstalk with CI/CD",
      },
      {
        text: "new ideas: [[Beyond Headless: Building a Decoupled Frontend with React & Contentful],[Serverless MERN Stack Deployment: A Guide to AWS Lambda and API Gateway],[MERN Stack Development Best Practices: A Guide to Clean Code, State Management, and Testing],[Building a Real-Time MERN Application with WebSockets],[A Beginner's Guide to Building Your First MERN Application]]",
      },
      {
        text: "past ideas: How the Web works - Behind the scenes,Javascript Design Patterns,Stateless web application,Load testing tools for web applications,8 best opensource projects you should try out",
      },
      {
        text: 'new ideas: [\n  ["Demystifying HTTP: A Deep Dive into the Web\'s Communication Protocol"],\n  ["Advanced JavaScript: Mastering Functional Programming Techniques"],\n  ["Building Scalable Web Apps: A Guide to Serverless Architecture"],\n  ["Performance Optimization Strategies for Web Applications"],\n  ["Open Source Power: Contributing to the Web Development Community"]\n]',
      },
      {
        text: `past ideas: ${data.map((project) => project.name).join(",")}`,
      },
    ];

    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts }],
      });

      const response = result.response;

      return response.text();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while generating ideas. Please try again later.",
      });
    }
  }

  async genIdeasBasedOnCategory(category: string, user_id: Types.ObjectId) {
    const parts = [
      {
        text: "Generate 5 new blog post ideas for a given category. Each idea should be unique and creative. Don't use markdown. Output should be an array of 5 arrays where each array is a single idea. Each idea's character length MUST be between 50 to 60 characters.",
      },
      { text: "category: UI design" },
      {
        text: 'new ideas: [\n["The Power of Microinteractions in UI Design"],\n["Designing for Inclusivity: A UI Guide"],\n["The Future of UI: AI-Powered Design"],\n["Beyond Aesthetics: The Role of UX in UI"],\n["Building a User-Centric UI: Best Practices"]\n]',
      },
      { text: "category: Software development" },
      {
        text: 'new ideas: [\n["The Rise of Serverless Architecture in Software Development"],\n["Demystifying Microservices: A Developer\'s Guide"],\n["Building Scalable Software: Best Practices"],\n["The Importance of Code Reviews in Software Development"],\n["The Future of Software Development: AI and Automation"]\n]',
      },
      { text: "category: Blockchain" },
      {
        text: 'new ideas: [\n["Understanding Blockchain\'s Impact on Supply Chains"],\n["Decentralized Finance (DeFi): The Future of Money?"],\n["Exploring the Potential of NFTs in Art and Collectibles"],\n["Building a Blockchain-Based Loyalty Program"],\n["The Role of Blockchain in Combating Counterfeiting"]\n]',
      },
      { text: `category: ${category}` },
    ];

    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts }],
      });

      const response = result.response;

      return response.text();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while generating ideas. Please try again later.",
      });
    }
  }
  async genIdeasBasedOnText(text: string, user_id: Types.ObjectId) {
    const parts = [
      {
        text: "Generate 5 new blog post ideas based on the given text. Each idea should be unique and creative. Don't use markdown. Output should be an array of 5 arrays where each array is a single idea. Each idea's character length MUST be between 50 to 60 characters.",
      },
      { text: "text: iPhone tips and tricks" },
      {
        text: 'new ideas: [\n  ["Unlock Hidden iPhone Features: Tips and Tricks You Didn\'t Know Existed"],\n  ["Master Your iPhone: Advanced Tips and Tricks for Power Users"],\n  ["iPhone Hacks That Will Change Your Life: Productivity and Fun Tips"],\n  ["Boost Your iPhone\'s Performance: Essential Tips and Tricks"],\n  ["Top 10 iPhone Tips and Tricks for Beginners"]\n]',
      },
      { text: "text: software engineering" },
      {
        text: 'new ideas: [\n  ["The Future of Software Engineering: Emerging Trends and Technologies"],\n  ["Building a Successful Software Engineering Career: Tips and Strategies"],\n  ["Mastering the Art of Code Optimization: Software Engineering Best Practices"],\n  ["The Ethical Dilemmas of Software Engineering: A Deep Dive"],\n  ["Demystifying Software Engineering: A Beginner\'s Guide"]\n]',
      },
      { text: `category: ${text}` },
    ];

    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts }],
      });

      const response = result.response;

      return response.text();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while generating ideas. Please try again later.",
      });
    }
  }
}
