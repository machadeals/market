import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Last Updated: 24-03-2025</strong>
        </Typography>

        <Typography variant="body1" paragraph>
          Welcome to <strong>Machadeals</strong> ("we," "our," or "us"). Your
          privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your information when you visit
          <strong>Machadeals.com</strong> (the "Website").
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Information We Do Not Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We do <strong>not</strong> collect or store any personally
          identifiable information (PII) such as:
          <ul>
            <li>Names</li>
            <li>Email addresses</li>
            <li>Phone numbers</li>
            <li>Payment information</li>
          </ul>
          Our Website does not require user registration or login.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We may collect limited data through:
        </Typography>

        <Typography variant="subtitle1">
          <strong>🔹 Local Storage</strong>
        </Typography>
        <Typography variant="body1" paragraph>
          We store non-sensitive information such as user{" "}
          <strong>roles and tokens</strong> in your browser’s local storage. No
          personal data is transmitted to our servers.
        </Typography>

        <Typography variant="subtitle1">
          <strong>🔹 Cookies & Tracking Technologies</strong>
        </Typography>
        <Typography variant="body1" paragraph>
          We may use third-party services like:
          <ul>
            <li>
              <strong>Google Analytics</strong> – to track website traffic
            </li>
            <li>
              <strong>Affiliate Networks (Amazon, Flipkart, etc.)</strong> – to
              track purchases through referral links
            </li>
          </ul>
          These services may collect anonymous data such as:
          <ul>
            <li>IP address (masked)</li>
            <li>Device type (mobile, desktop)</li>
            <li>Browsing behavior (pages visited, time spent)</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. How We Use Collected Information
        </Typography>
        <Typography variant="body1" paragraph>
          The limited data we collect is used to:
          <ul>
            <li>Improve website functionality</li>
            <li>Analyze visitor trends</li>
            <li>Track affiliate link performance</li>
          </ul>
          We do <strong>not</strong> sell or share collected information.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Affiliate Links & Third-Party Websites
        </Typography>
        <Typography variant="body1" paragraph>
          Our Website contains <strong>affiliate links</strong> to third-party
          websites (e.g., Amazon, Flipkart). When you <strong>click</strong> an
          affiliate link and make a purchase, we may earn a commission. These
          third-party sites have their <strong>own privacy policies</strong>.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Your Privacy Choices
        </Typography>
        <Typography variant="body1" paragraph>
          <ul>
            <li>
              <strong>Disable Cookies:</strong> You can adjust your browser
              settings to block cookies.
            </li>
            <li>
              <strong>Clear Local Storage:</strong> You can manually delete your
              browser’s local storage at any time.
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We do <strong>not</strong> store user data on our servers. Any
          information stored in <strong>local storage</strong> remains on your
          device.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We may update this Privacy Policy from time to time. The latest
          version will always be available on this page.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about this Privacy Policy, contact us at:
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> machadealsecom@gmail.com
        </Typography>
        <Typography variant="body1">
          <strong>Website:</strong> machadeals.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
