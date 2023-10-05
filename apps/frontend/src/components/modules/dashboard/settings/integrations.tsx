"use client";

import { Heading } from "@/components/ui/heading";
import { DevConnectForm, DevEditForm } from "./platforms/dev";
import { PlatformCard } from "./platforms/platform-card";
import { MediumConnectForm, MediumEditForm } from "./platforms/medium";
import { HashnodeConnectForm, HashnodeEditForm } from "./platforms/hashnode";

interface IntegrationsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Integrations({ ...props }: IntegrationsProps) {
    return (
        <div className="space-y-8" {...props}>
            <div className="space-y-2">
                <Heading>Integrations</Heading>
                <p className="text-muted-foreground">
                    Configure your platforms and other integrations
                </p>
            </div>
            <div className="space-y-4">
                <Heading level={2}>Platforms</Heading>
                <div className="grid grid-cols-2 gap-4">
                    <PlatformCard
                        name="Dev"
                        icon="/images/platforms/dev-logo.png"
                        connected={false}
                        // username="itsrakesh"
                        // profile_url="https://dev.to/@itsrakesh"
                        // editForm={<DevEditForm default_publish_status="true" />}
                        connectForm={<DevConnectForm />}
                    />
                    <PlatformCard
                        name="Medium"
                        icon="/images/platforms/medium-logo.jpeg"
                        connected={true}
                        username="itsrakesh"
                        profile_url="https://dev.to/@itsrakesh"
                        editForm={
                            <MediumEditForm
                                default_publish_status="unlisted"
                                notify_followers="true"
                            />
                        }
                        // connectForm={<MediumConnectForm />}
                    />
                    <PlatformCard
                        name="Hashnode"
                        icon="/images/platforms/hashnode-logo.jpeg"
                        connected={true}
                        username="itsrakesh"
                        profile_url="https://dev.to/@itsrakesh"
                        editForm={<HashnodeEditForm username="itsrakesh" />}
                        // connectForm={<HashnodeConnectForm />}
                    />
                </div>
            </div>
        </div>
    );
}
