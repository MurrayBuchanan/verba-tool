import type {ReactNode} from 'react';
import {Redirect} from '@docusaurus/router';

/**
 * Root URL redirects straight into the docs. The previous marketing-style
 * homepage lives in git history; this file stays so `/` is still a valid route.
 */
export default function Home(): ReactNode {
  return <Redirect to="/docs/introduction" />;
}