"use client";

import { Heading } from "@/components/ui/heading";
import { Images } from "@/components/ui/images";
import { DevConnectForm } from "./platforms/dev";
import { HashnodeEditForm } from "./platforms/hashnode";
import { MediumEditForm } from "./platforms/medium";
import { PlatformCard } from "./platforms/platform-card";

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
                        icon={Images.devLogo}
                        connected={false}
                        // username="itsrakesh"
                        // profile_url="https://dev.to/@itsrakesh"
                        // editForm={<DevEditForm default_publish_status="true" />}
                        connectForm={<DevConnectForm />}
                    />
                    <PlatformCard
                        name="Medium"
                        icon={Images.mediumLogo}
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
                        icon={Images.hashnodeLogo}
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
