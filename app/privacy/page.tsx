export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto prose prose-slate">
            <h1>Privacy Policy</h1>
            <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

            <h2>1. Overview</h2>
            <p>
                This Privacy Policy describes how CoreVAI Social (“we”, “us”) collects, uses, and protects
                your information when you use our Service.
            </p>

            <h2>2. Information We Collect</h2>
            <ul>
                <li><strong>Account data:</strong> name, email, workspace details.</li>
                <li><strong>Usage data:</strong> app interactions, device/browser info, pages visited.</li>
                <li><strong>Content data:</strong> posts, captions, media you upload or generate.</li>
                <li><strong>Billing data:</strong> handled by payment processors (we don’t store card numbers).</li>
            </ul>

            <h2>3. How We Use Information</h2>
            <ul>
                <li>Provide and improve the Service.</li>
                <li>Generate and schedule content with AI features.</li>
                <li>Analytics and product research (aggregated or pseudonymized).</li>
                <li>Security, fraud prevention, and legal compliance.</li>
            </ul>

            <h2>4. Sharing</h2>
            <ul>
                <li>Service providers (hosting, analytics, payments) under contractual obligations.</li>
                <li>Third-party platforms you connect (e.g., social networks) per your authorization.</li>
                <li>Legal requests where required by law.</li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>
                We retain data for as long as necessary to provide the Service and comply with legal obligations.
            </p>

            <h2>6. Security</h2>
            <p>
                We use reasonable technical and organizational measures to protect your information, but no
                method is 100% secure.
            </p>

            <h2>7. Your Rights</h2>
            <ul>
                <li>Access, update, or delete your information (subject to legal limits).</li>
                <li>Opt-out of marketing communications.</li>
                <li>Disconnect third-party integrations at any time.</li>
            </ul>

            <h2>8. International Transfers</h2>
            <p>
                Data may be processed in other countries. We rely on appropriate safeguards when required.
            </p>

            <h2>9. Children</h2>
            <p>
                The Service is not directed to children under 13 (or the applicable age in your jurisdiction).
            </p>

            <h2>10. Changes</h2>
            <p>
                We may update this policy. Continued use after changes indicates acceptance.
            </p>

            <h2>11. Contact</h2>
            <p>
                For privacy questions: privacy@corevai.social
            </p>
        </div>
    );
}