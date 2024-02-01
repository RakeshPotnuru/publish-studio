/**  Extension by y4aniv on GitHub:
 * @see: https://github.com/y4aniv/TipTap-SpeechRecognition
 **/

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable unicorn/consistent-function-scoping */

import { Node } from "@tiptap/core";
import type { Commands } from "@tiptap/react";

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export interface SpeechRecognitionOptions {
    lang: string;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        SpeechRecognition: {
            startSpeechRecognition: () => ReturnType;
            stopSpeechRecognition: () => ReturnType;
        };
    }
}

class SRNode<O = any, S = any> extends Node<O, S> {
    recognition: any;
    static create<O = any, S = any>(config?: any) {
        return Node.create(config) as SRNode<O, S>;
    }
}

const SpeechRecognition = SRNode.create<SpeechRecognitionOptions>({
    name: "SpeechRecognition",

    addOptions() {
        return {
            lang: "en-US",
        };
    },

    addCommands() {
        return {
            startSpeechRecognition:
                () =>
                ({ commands }: { commands: Commands }) => {
                    const SpeechRecognition =
                        window.SpeechRecognition || window.webkitSpeechRecognition;
                    this.recognition = new SpeechRecognition();

                    this.recognition.lang = this.options.lang;
                    this.recognition.interimResults = true;
                    this.recognition.maxAlternatives = 1;
                    this.recognition.continuous = true;

                    this.recognition.start();

                    this.recognition.contentLength = this.editor.getText().length + 1;
                    this.recognition.quoicoubeh = null;

                    this.recognition.onresult = (event: any) => {
                        // If the length of the content of the editor is less than the length of the recognized content, redefine the variable contentLength taking into account the length of the recognized content
                        if (this.recognition.contentLength > this.editor.getText().length + 1) {
                            this.recognition.contentLength = this.editor.getText().length + 1;
                        }

                        this.recognition.currentResult = "";

                        // Add to the currentResult variable the content of the last recognized sentence
                        for (let i = event.resultIndex; i < event.results.length; i++) {
                            this.recognition.currentResult += event.results[i][0].transcript;
                        }

                        // Delete the last sentence displayed (currentResult) in the editor
                        this.editor.commands.deleteRange({
                            from: this.recognition.contentLength,
                            to: this.editor.getText().length + 1,
                        });

                        // Add the last recognized sentence (currentResult) in the editor with a style
                        this.editor.commands.insertContentAt(
                            this.recognition.contentLength,
                            `<code>${this.recognition.currentResult}</code>`,
                        );

                        // If the last recognized sentence is final, delete the last recognized sentence (currentResult) in the editor and rewrite the last recognized sentence (currentResult) in the editor without style
                        if (event.results.at(-1).isFinal) {
                            this.editor.commands.deleteRange({
                                from: this.recognition.contentLength,
                                to: this.editor.getText().length + 1,
                            });
                            this.editor.commands.insertContentAt(
                                this.recognition.contentLength,
                                this.recognition.currentResult,
                            );

                            // Redefine the variable contentLength taking into account the last recognized sentence
                            this.recognition.contentLength +=
                                event.results.at(-1)[0].transcript.length + 1;
                        }
                    };

                    return commands;
                },

            stopSpeechRecognition:
                () =>
                ({ commands }: { commands: Commands }) => {
                    this.recognition.stop();
                    this.editor.commands.focus();
                    this.recognition.lastResult = "";
                    return commands;
                },
        };
    },
});

export default SpeechRecognition;
