import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { LinkButton } from "@/components/ui/link-button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.privacyPolicy.title,
  description: siteConfig.pages.privacyPolicy.description,
};

export const Section = ({
  children,
  ...props
}: Readonly<React.HTMLAttributes<HTMLElement>>) => {
  return (
    <section className="space-y-4" {...props}>
      {children}
    </section>
  );
};

export const List = ({
  children,
}: Readonly<React.HTMLAttributes<HTMLElement>>) => {
  return <ul className="list-inside list-disc">{children}</ul>;
};

export default function PrivacyPolicyPage() {
  return (
    <div className="m-10 space-y-8">
      <Section>
        <Heading>PRIVACY POLICY</Heading>
        <p className="text-xs font-bold">Last updated February 19, 2024</p>
      </Section>
      <Section>
        <p>
          This privacy notice for Publish Studio (
          <strong>&quot;we,&quot; &quot;us,&quot;</strong> or
          <strong>&quot;our&quot;</strong>), describes how and why we might
          collect, store, use, and/or share (
          <strong>&quot;process&quot;</strong>) your information when you use
          our services (<strong>&quot;Services&quot;</strong>), such as when
          you:
        </p>
        <List>
          <li>
            Visit our website at{" "}
            <LinkButton href={siteConfig.url}>{siteConfig.url}</LinkButton>, or
            any website of ours that links to this privacy notice
          </li>
          <li>
            Engage with us in other related ways, including any sales,
            marketing, or events
          </li>
        </List>
        <p>
          <strong>Questions or concerns?</strong> Reading this privacy notice
          will help you understand your privacy rights and choices. If you do
          not agree with our policies and practices, please do not use our
          Services. If you still have any questions or concerns, please contact
          us at support@publishstudio.one.
        </p>
      </Section>
      <Section>
        <Heading level={2}>SUMMARY OF KEY POINTS</Heading>
        <p className="font-bold italic">
          This summary provides key points from our privacy notice, but you can
          find out more details about any of these topics by clicking the link
          following each key point or by using our{" "}
          <LinkButton href="#toc" target="_parent">
            table of contents
          </LinkButton>{" "}
          below to find the section you are looking for.
        </p>
        <p>
          <strong>What personal information do we process?</strong> When you
          visit, use, or navigate our Services, we may process personal
          information depending on how you interact with us and the Services,
          the choices you make, and the products and features you use.
        </p>
        <p>
          <strong>Do we process any sensitive personal information?</strong> We
          do not process sensitive information.
        </p>
        <p>
          <strong>Do we receive any information from third parties?</strong> We
          may receive information from public databases, marketing partners,
          social media platforms, and other outside sources.
        </p>
        <p>
          <strong>How do we process your information?</strong> We process your
          information to provide, improve, and administer our Services,
          communicate with you, for security and fraud prevention, and to comply
          with law. We may also process your information for other purposes with
          your consent. We process your information only when we have a valid
          legal reason to do so.
        </p>
        <p>
          <strong>
            In what situations and with which parties do we share personal
            information?
          </strong>{" "}
          We may share information in specific situations and with specific
          third parties.
        </p>
        <p>
          <strong>How do we keep your information safe?</strong> We have
          organizational and technical processes and procedures in place to
          protect your personal information. However, no electronic transmission
          over the internet or information storage technology can be guaranteed
          to be 100% secure, so we cannot promise or guarantee that hackers,
          cyber-criminals, or other unauthorized third parties will not be able
          to defeat our security and improperly collect, access, steal, or
          modify your information.
        </p>
        <p>
          <strong>What are your rights?</strong> Depending on where you are
          located geographically, the applicable privacy law may mean you have
          certain rights regarding your personal information.
        </p>
        <p>
          How do you exercise your rights? The easiest way to exercise your
          rights is by visiting{" "}
          <LinkButton href={`${siteConfig.links.mainApp}/profile`}>
            {siteConfig.links.mainApp}/profile
          </LinkButton>
          , or by contacting us. We will consider and act upon any request in
          accordance with applicable data protection laws.
        </p>
        Want to learn more about what we do with any information we collect?{" "}
        <LinkButton href="#toc" target="_parent">
          Review the privacy notice in full
        </LinkButton>
        .
      </Section>
      <Section id="toc">
        <Heading level={2}>TABLE OF CONTENTS</Heading>
        <ol className="list-inside list-decimal">
          <li>
            <LinkButton href="#info-collect" target="_parent">
              WHAT INFORMATION DO WE COLLECT?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#info-use" target="_parent">
              HOW DO WE PROCESS YOUR INFORMATION?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#who-share" target="_parent">
              WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#cookies" target="_parent">
              DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#social-logins" target="_parent">
              HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#info-retain" target="_parent">
              HOW LONG DO WE KEEP YOUR INFORMATION?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#info-safe" target="_parent">
              HOW DO WE KEEP YOUR INFORMATION SAFE?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#info-minors" target="_parent">
              DO WE COLLECT INFORMATION FROM MINORS?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#privacy-rights" target="_parent">
              WHAT ARE YOUR PRIVACY RIGHTS?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#DNT" target="_parent">
              CONTROLS FOR DO-NOT-TRACK FEATURES
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#policy-updates" target="_parent">
              DO WE MAKE UPDATES TO THIS NOTICE?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#contact" target="_parent">
              HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </LinkButton>
          </li>
          <li>
            <LinkButton href="#request" target="_parent">
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </LinkButton>
          </li>
        </ol>
      </Section>
      <ol className="list-inside list-decimal space-y-8">
        <Section id="info-collect">
          <Heading level={2}>
            <li>WHAT INFORMATION DO WE COLLECT?</li>
          </Heading>
          <Heading level={3}>Personal information you disclose to us</Heading>
          <p className="italic">
            <strong>In Short:</strong> We collect personal information that you
            provide to us.
          </p>
          <p>
            We collect personal information that you voluntarily provide to us
            when you register on the Services, express an interest in obtaining
            information about us or our products and Services, when you
            participate in activities on the Services, or otherwise when you
            contact us.
          </p>
          <p>
            <strong> Personal Information Provided by You.</strong>The personal
            information that we collect depends on the context of your
            interactions with us and the Services, the choices you make, and the
            products and features you use. The personal information we collect
            may include the following:
          </p>
          <List>
            <li>names</li>
            <li>email addresses</li>
            <li>passwords</li>
          </List>
          <p>
            <strong>Sensitive Information.</strong> We do not process sensitive
            information.
          </p>
          <p>
            <strong>Social Media Login Data.</strong> We may provide you with
            the option to register with us using your existing social media
            account details, like your Facebook, Twitter, or other social media
            account. If you choose to register in this way, we will collect the
            information described in the section called &quot;
            <LinkButton href="#social-logins" target="_parent">
              HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </LinkButton>
            &quot; below.
          </p>
          <p>
            All personal information that you provide to us must be true,
            complete, and accurate, and you must notify us of any changes to
            such personal information.
          </p>
          <Heading level={3}>Information collected from other sources</Heading>
          <p className="italic">
            <strong>In Short:</strong> We may collect limited data from public
            databases, marketing partners, social media platforms, and other
            outside sources.
          </p>
          <p>
            In order to enhance our ability to provide relevant marketing,
            offers, and services to you and update our records, we may obtain
            information about you from other sources, such as public databases,
            joint marketing partners, affiliate programs, data providers, social
            media platforms, and from other third parties. This information
            includes mailing addresses, job titles, email addresses, phone
            numbers, intent data (or user behavior data), Internet Protocol (IP)
            addresses, social media profiles, social media URLs, and custom
            profiles, for purposes of targeted advertising and event promotion.
            If you interact with us on a social media platform using your social
            media account (e.g., Facebook or Twitter), we receive personal
            information about you such as your name, email address, and gender.
            Any personal information that we collect from your social media
            account depends on your social media account&apos;s privacy
            settings.
          </p>
        </Section>
        <Section id="info-use">
          <Heading level={2}>
            <li>HOW DO WE PROCESS YOUR INFORMATION?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> We process your information to provide,
            improve, and administer our Services, communicate with you, for
            security and fraud prevention, and to comply with law. We may also
            process your information for other purposes with your consent.
          </p>
          <strong>
            We process your personal information for a variety of reasons,
            depending on how you interact with our Services, including:
          </strong>
          <List>
            <li>
              <strong>
                To facilitate account creation and authentication and otherwise
                manage user accounts.
              </strong>{" "}
              We may process your information so you can create and log in to
              your account, as well as keep your account in working order.
            </li>
            <li>
              <strong>
                To deliver and facilitate delivery of services to the user.
              </strong>{" "}
              We may process your information to provide you with the requested
              service.
            </li>
            <li>
              <strong>To send administrative information to you.</strong> We may
              process your information to send you details about our products
              and services, changes to our terms and policies, and other similar
              information.
            </li>
          </List>
        </Section>
        <Section id="who-share">
          <Heading level={2}>
            <li>WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> We may share information in specific
            situations described in this section and/or with the following third
            parties.
          </p>
          <p>
            We may need to share your personal information in the following
            situations:
          </p>
          <List>
            <li>
              Business Transfers. We may share or transfer your information in
              connection with, or during negotiations of, any merger, sale of
              company assets, financing, or acquisition of all or a portion of
              our business to another company.
            </li>
          </List>
        </Section>
        <Section id="cookies">
          <Heading level={2}>
            <li>DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> We may use cookies and other tracking
            technologies to collect and store your information.
          </p>
          <p>
            We may use cookies and similar tracking technologies (like web
            beacons and pixels) to access or store information. Specific
            information about how we use such technologies and how you can
            refuse certain cookies is set out in our Cookie Notice:{" "}
            <LinkButton href={`${siteConfig.url}/cookies`}>
              {siteConfig.url}/cookies
            </LinkButton>
            .
          </p>
        </Section>
        <Section id="social-logins">
          <Heading level={2}>
            <li>HOW DO WE HANDLE YOUR SOCIAL LOGINS?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> If you choose to register or log in to
            our Services using a social media account, we may have access to
            certain information about you.
          </p>
          <p>
            Our Services offer you the ability to register and log in using your
            third-party social media account details (like your Facebook or
            Twitter logins). Where you choose to do this, we will receive
            certain profile information about you from your social media
            provider. The profile information we receive may vary depending on
            the social media provider concerned, but will often include your
            name, email address, friends list, and profile picture, as well as
            other information you choose to make public on such a social media
            platform.
          </p>
          <p>
            We will use the information we receive only for the purposes that
            are described in this privacy notice or that are otherwise made
            clear to you on the relevant Services. Please note that we do not
            control, and are not responsible for, other uses of your personal
            information by your third-party social media provider. We recommend
            that you review their privacy notice to understand how they collect,
            use, and share your personal information, and how you can set your
            privacy preferences on their sites and apps.
          </p>
        </Section>
        <Section id="info-retain">
          <Heading level={2}>
            <li>HOW LONG DO WE KEEP YOUR INFORMATION?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> We keep your information for as long as
            necessary to fulfill the purposes outlined in this privacy notice
            unless otherwise required by law.
          </p>
          <p>
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this privacy notice, unless a
            longer retention period is required or permitted by law (such as
            tax, accounting, or other legal requirements). No purpose in this
            notice will require us keeping your personal information for longer
            than the period of time in which users have an account with us.
          </p>
          <p>
            When we have no ongoing legitimate business need to process your
            personal information, we will either delete or anonymize such
            information, or, if this is not possible (for example, because your
            personal information has been stored in backup archives), then we
            will securely store your personal information and isolate it from
            any further processing until deletion is possible.
          </p>
        </Section>
        <Section id="info-safe">
          <Heading level={2}>
            <li>HOW DO WE KEEP YOUR INFORMATION SAFE?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> We aim to protect your personal
            information through a system of organizational and technical
            security measures.
          </p>
          <p>
            We have implemented appropriate and reasonable technical and
            organizational security measures designed to protect the security of
            any personal information we process. However, despite our safeguards
            and efforts to secure your information, no electronic transmission
            over the Internet or information storage technology can be
            guaranteed to be 100% secure, so we cannot promise or guarantee that
            hackers, cyber-criminals, or other unauthorized third parties will
            not be able to defeat our security and improperly collect, access,
            steal, or modify your information. Although we will do our best to
            protect your personal information, transmission of personal
            information to and from our Services is at your own risk. You should
            only access the Services within a secure environment.
          </p>
        </Section>
        <Section id="info-minors">
          <Heading level={2}>
            <li>DO WE COLLECT INFORMATION FROM MINORS?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> We do not knowingly collect data from or
            market to children under 18 years of age.
          </p>
          <p>
            We do not knowingly solicit data from or market to children under 18
            years of age. By using the Services, you represent that you are at
            least 18 or that you are the parent or guardian of such a minor and
            consent to such minor dependent&apos;s use of the Services. If we
            learn that personal information from users less than 18 years of age
            has been collected, we will deactivate the account and take
            reasonable measures to promptly delete such data from our records.
            If you become aware of any data we may have collected from children
            under age 18, please contact us at support@publishstudio.one.
          </p>
        </Section>
        <Section id="privacy-rights">
          <Heading level={2}>
            <li>WHAT ARE YOUR PRIVACY RIGHTS?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> You may review, change, or terminate your
            account at any time.
          </p>
          <p>
            <strong className="underline">Withdrawing your consent:</strong> If
            we are relying on your consent to process your personal information,
            which may be express and/or implied consent depending on the
            applicable law, you have the right to withdraw your consent at any
            time. You can withdraw your consent at any time by contacting us by
            using the contact details provided in the section &quot;HOW CAN YOU
            CONTACT US ABOUT THIS NOTICE?&quot; below.
          </p>
          <p>
            However, please note that this will not affect the lawfulness of the
            processing before its withdrawal nor, when applicable law allows,
            will it affect the processing of your personal information conducted
            in reliance on lawful processing grounds other than consent.
          </p>
          <Heading level={3}>Account Information</Heading>
          <p>
            If you would at any time like to review or change the information in
            your account or terminate your account, you can:
          </p>
          <List>
            <li>
              Log in to your account settings and update your user account.
            </li>
            <li>Contact us using the contact information provided.</li>
          </List>
          <p>
            Upon your request to terminate your account, we will deactivate or
            delete your account and information from our active databases.
            However, we may retain some information in our files to prevent
            fraud, troubleshoot problems, assist with any investigations,
            enforce our legal terms and/or comply with applicable legal
            requirements.
          </p>
          <p>
            <strong className="underline">
              Cookies and similar technologies:
            </strong>{" "}
            Most Web browsers are set to accept cookies by default. If you
            prefer, you can usually choose to set your browser to remove cookies
            and to reject cookies. If you choose to remove cookies or reject
            cookies, this could affect certain features or services of our
            Services. For further information, please see our Cookie Notice:{" "}
            <LinkButton href={`${siteConfig.url}/cookies`}>
              {siteConfig.url}/cookies
            </LinkButton>
            .
          </p>
          <p>
            If you have questions or comments about your privacy rights, you may
            email us at support@publishstudio.one.
          </p>
        </Section>
        <Section id="DNT">
          <Heading level={2}>
            <li>CONTROLS FOR DO-NOT-TRACK FEATURES</li>
          </Heading>
          <p>
            Most web browsers and some mobile operating systems and mobile
            applications include a Do-Not-Track (&quot;DNT&quot;) feature or
            setting you can activate to signal your privacy preference not to
            have data about your online browsing activities monitored and
            collected. At this stage no uniform technology standard for
            recognizing and implementing DNT signals has been finalized. As
            such, we do not currently respond to DNT browser signals or any
            other mechanism that automatically communicates your choice not to
            be tracked online. If a standard for online tracking is adopted that
            we must follow in the future, we will inform you about that practice
            in a revised version of this privacy notice.
          </p>
        </Section>
        <Section id="policy-updates">
          <Heading level={2}>
            <li>DO WE MAKE UPDATES TO THIS NOTICE?</li>
          </Heading>
          <p className="italic">
            <strong>In Short:</strong> Yes, we will update this notice as
            necessary to stay compliant with relevant laws.
          </p>
          <p>
            We may update this privacy notice from time to time. The updated
            version will be indicated by an updated &quot;Revised&quot; date and
            the updated version will be effective as soon as it is accessible.
            If we make material changes to this privacy notice, we may notify
            you either by prominently posting a notice of such changes or by
            directly sending you a notification. We encourage you to review this
            privacy notice frequently to be informed of how we are protecting
            your information.
          </p>
        </Section>
        <Section id="contact">
          <Heading level={2}>
            <li>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</li>
          </Heading>
          <p>
            If you have questions or comments about this notice, you may email
            us at support@publishstudio.one.
          </p>
        </Section>
        <Section id="request">
          <Heading level={2}>
            <li>
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </li>
          </Heading>
          <p>
            Based on the applicable laws of your country, you may have the right
            to request access to the personal information we collect from you,
            change that information, or delete it. To request to review, update,
            or delete your personal information, please visit:{" "}
            <LinkButton href={`${siteConfig.links.mainApp}/profile`}>
              {siteConfig.links.mainApp}/profile
            </LinkButton>
            .
          </p>
        </Section>
      </ol>
    </div>
  );
}
