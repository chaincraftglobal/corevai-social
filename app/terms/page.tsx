export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto prose prose-slate">
            <h1>Terms of Service</h1>
            <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

            <h2>1. Agreement</h2>
            <p>
                By accessing or using CoreVAI Social (“Service”), you agree to be bound by these Terms.
                If you do not agree, do not use the Service.
            </p>

            <h2>2. Eligibility</h2>
            <p>
                You must be at least 13 years old (or the minimum age in your country) to use the Service.
            </p>

            <h2>3. Accounts</h2>
            <ul>
                <li>Keep your account credentials confidential.</li>
                <li>You’re responsible for activity under your account.</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <ul>
                <li>No unlawful, harmful, or infringing content.</li>
                <li>No attempts to disrupt or reverse-engineer the Service.</li>
                <li>Respect third-party platform terms (e.g., LinkedIn, X/Twitter, Instagram).</li>
            </ul>

            <h2>5. AI-Generated Content</h2>
            <p>
                Content produced by AI features is provided “as-is.” You are responsible for reviewing and
                ensuring compliance with applicable laws and platform policies.
            </p>

            <h2>6. Subscriptions & Trials</h2>
            <ul>
                <li>Paid plans auto-renew unless cancelled before the renewal date.</li>
                <li>Trials convert to paid unless cancelled before trial end.</li>
                <li>Fees are non-refundable except where required by law.</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>
                We retain all rights to the Service. You retain rights to your own content submitted to or
                generated via the Service, subject to third-party terms.
            </p>

            <h2>8. Disclaimers</h2>
            <p>
                The Service is provided “as-is” without warranties of any kind. We do not guarantee results,
                availability, or error-free operation.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
                To the maximum extent permitted by law, CoreVAI Social is not liable for indirect or
                consequential damages. Our total liability shall not exceed the fees paid in the last 12 months.
            </p>

            <h2>10. Termination</h2>
            <p>
                We may suspend or terminate access for violations of these Terms or suspected abuse.
            </p>

            <h2>11. Changes</h2>
            <p>
                We may update these Terms. Continued use after changes means you accept the updated Terms.
            </p>

            <h2>12. Contact</h2>
            <p>
                For questions: support@corevai.social
            </p>
        </div>
    );
}