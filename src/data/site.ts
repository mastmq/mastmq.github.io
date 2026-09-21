// One place for anything that appears in more than one component, so the
// page and the metadata cannot drift apart.
export const site = {
  name: 'mast',
  tagline: 'Multi-tenant MQTT broker built on core NATS',
  blurb: 'One binary, from an edge box to a clustered fleet.',
  repo: 'https://github.com/mastmq/mast',
  org: 'https://github.com/mastmq',
  migrationGuide:
    'https://github.com/mastmq/docs/blob/main/guides/migrating-from-emqx.md',
  parityIssues:
    'https://github.com/mastmq/mast/issues?q=is%3Aissue+is%3Aopen+label%3Aparity',
} as const;

export const badges = [
  'MQTT 3.1.1 & 5.0',
  'Shared subscriptions',
  'Apache 2.0',
  'No JVM',
] as const;

// Each row is what that broker asks you to give up. The point of the table
// is the catch, not the feature matrix.
export const alternatives = [
  {
    broker: 'EMQX',
    catch:
      'Business Source License since 5.9 — clustering more than one node needs a paid licence key.',
  },
  {
    broker: 'BifroMQ',
    catch: 'Genuine native multi-tenancy, but it runs on the JVM.',
  },
  {
    broker: 'VerneMQ',
    catch:
      'Apache 2.0 source, but the official packages and images are under a EULA that charges for commercial use.',
  },
  {
    broker: 'RabbitMQ',
    catch: 'vhosts, but no QoS 2 and no shared subscriptions.',
  },
  {
    broker: 'Mosquitto, NanoMQ, FlashMQ, mochi',
    catch: 'Do not cluster at all.',
  },
] as const;

export const pillars = [
  {
    title: 'Core NATS moves messages',
    body: 'Live fan-out rides core NATS, which handles tens of millions of subjects at roughly a gigabyte of memory per million subscriptions.',
  },
  {
    title: 'A key-value store holds keys',
    body: 'Sessions, retained messages and offline queues live in a handful of JetStream KV buckets. Never a consumer per subscription: consumers are Raft state machines, and a real fleet would want hundreds of thousands.',
  },
  {
    title: 'Isolation is structural',
    body: 'Every topic is mounted under its tenant before validation, authorization or subscription sees it, and unmounted on the way out. A client never learns the prefix exists.',
  },
  {
    title: 'Authentication, two ways',
    body: 'Ask an HTTP service, or verify a signed token locally. They compose: authenticate from a token while topic decisions still go to a policy server.',
  },
] as const;

export const repos = [
  { name: 'mast', url: 'https://github.com/mastmq/mast', what: 'The broker.' },
  { name: 'charts', url: 'https://github.com/mastmq/charts', what: 'Helm charts.' },
  { name: 'docs', url: 'https://github.com/mastmq/docs', what: 'Architecture notes and operational guides.' },
  { name: 'bench', url: 'https://github.com/mastmq/bench', what: 'Load and latency benchmarks.' },
] as const;
