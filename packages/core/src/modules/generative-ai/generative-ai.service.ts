import { TRPCError } from "@trpc/server";
import type { Request, Response } from "express";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app";
import { constants } from "../../config/constants";
import { ai } from "../../utils/google/gemini";
import { logtail } from "../../utils/logtail";
import ProjectService from "../project/project.service";

export default class GenerativeAIService extends ProjectService {
  async generateTitle(topic: string, user_id: Types.ObjectId) {
    const parts = [
      { text: "Topic: What is backend testing?" },
      {
        text: "Title: What is Backend Testing? - Essential Techniques Unveiled",
      },
      { text: "Topic: Data science vs web development" },
      {
        text: "Title: Data Science vs Web Dev: Comparing Two Booming Tech Fields",
      },
      { text: "Topic: HTTP Status Codes" },
      { text: "Title: A Guide to HTTP Status Codes: What Each Code Means" },
      { text: "Topic: Is Webassembly the future?" },
      {
        text: "Title: Is WebAssembly the Future? The Next Frontier in Web Dev",
      },
      { text: "Topic: What is load balancing and how does it work?" },
      {
        text: "Title: How Load Balancing Works to Optimize Traffic Distribution",
      },
      { text: `Topic: ${topic}` },
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

  async generateDescription(title: string, user_id: Types.ObjectId) {
    const parts = [
      {
        text: "Title: Data Science vs Web Dev: Comparing Two Booming Tech Fields",
      },
      {
        text: "Description: Compares data science and web development. Analyzes core components, career pathways, and required skills. Discusses intersection to determine the right career path.",
      },
      { text: "Title: A Guide to HTTP Status Codes: What Each Code Means" },
      {
        text: "Description: Unlock the mystery of HTTP status codes with our comprehensive guide. Learn about different codes, their meanings, and how to troubleshoot issues.",
      },
      {
        text: "Title: Is WebAssembly the Future? The Next Frontier in Web Dev",
      },
      {
        text: "Description: Explore the potential of WebAssembly and dive into the question: Is WebAssembly the future? Uncover its impact on web dev and the evolving digital landscape.",
      },
      {
        text: "Title: Javascript vs Typescript: Key differences, the best choice",
      },
      {
        text: "Description: Practical comparison of TypeScript and JavaScript, including key differences, pros/cons, suitability for future development, and TS-to-JS conversion examples.",
      },
      {
        text: "Title: How Load Balancing Works to Optimize Traffic Distribution",
      },
      {
        text: "Description: Discover the power of load balancing! Learn how it optimizes traffic distribution for seamless user experiences. Dive into the world of efficient network management.",
      },
      { text: `Title: ${title}` },
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
}
