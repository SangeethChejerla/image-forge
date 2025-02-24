import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Welcome to ImageForge</h1>
      <p className="text-lg text-gray-300">
        A sleek, powerful tool for editing images and PDFs. Select a feature from the sidebar to begin!
      </p>
    </Layout>
  );
}