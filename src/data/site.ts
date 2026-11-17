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
  deliveryGuide:
    'https://github.com/mastmq/docs/blob/main/guides/delivery-guarantees.md',
  license: 'Apache-2.0',
  licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
  language: 'Go',
} as const;

// What the page is about, in the words someone would actually search for.
// These feed the structured data rather than a meta keywords tag, which no
// engine has read for well over a decade.
export const keywords = [
  'MQTT broker',
  'multi-tenant MQTT',
  'MQTT 5',
  'NATS',
  'EMQX alternative',
  'shared subscriptions',
  'open source message broker',
  'IoT',
] as const;

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
    body: 'Sessions, retained messages and offline queues live in a handful of replicated JetStream buckets and streams, kept by the core tier, so a sleeping device keeps its messages when its edge restarts. Never a consumer per subscription: consumers are Raft state machines, and a real fleet would want hundreds of thousands.',
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
  { name: 'ansible', url: 'https://github.com/mastmq/ansible', what: 'An Ansible collection for virtual machines and bare metal.' },
  { name: 'docs', url: 'https://github.com/mastmq/docs', what: 'Architecture notes and operational guides.' },
  { name: 'bench', url: 'https://github.com/mastmq/bench', what: 'Load and latency benchmarks.' },
  { name: 'mochi', url: 'https://github.com/mastmq/mochi', what: 'The MQTT library the broker embeds, carrying fixes upstream has not merged.' },
] as const;

// The numbered steps under the architecture figure. The badges in
// Architecture.astro carry the same numbers.
export const flow = [
  'A QoS 1 or 2 publish is written to mast_qos, replicated on three cores, before the device gets its PUBACK. QoS 0 is never stored.',
  'Live delivery rides core NATS to every node with a subscriber. Each node also reads mast_qos through one consumer of its own, so a node cut off from the core catches up when it returns.',
  'Each core’s queuer watches the sessions bucket for devices that are away, and copies their QoS 1/2 messages into mast_offline. Every writer names a message the same way, so the stream keeps one copy however many wrote it.',
  'When the device comes back, to any edge, that edge reads its queue with a direct get, delivers it, and removes only what it read. No consumer is ever created per device.',
] as const;

// Drills against a real cluster in Docker: three cores, three edges, kills
// with SIGKILL. "Before" is the build just ahead of the change that moved
// offline queueing to the core tier; "after" is that change. Losses here
// are counted per message by payload, not inferred from rates.
export const drills = {
  when: '2026-11-16',
  shape: 'three cores and three edges in Docker on one laptop (6 CPUs)',
  rows: [
    {
      drill: '2,000 sleeping devices, every edge restarted in turn',
      before: '10,000 of 10,000 lost',
      after: 'none lost',
    },
    {
      drill: '5,000 sleeping devices, 100,000 messages, a core and two edges killed',
      before: 'not run',
      after: 'none lost, 9 runs of 9',
    },
    {
      drill: '1,500 subscribers to 2,000 retained topics at once',
      before: '924 of 1,500 complete after 2m 10s',
      after: '1,500 of 1,500 in 8.5s',
    },
    {
      drill: 'QoS 1, 5,000 msg/s to 5 subscribers',
      before: 'none lost, p99 1.4ms',
      after: 'none lost, p99 4.1ms',
    },
    {
      drill: 'QoS 1 fan-out to 2,000 subscribers',
      before: 'none lost, p99 110ms',
      after: 'none lost, p99 74ms',
    },
    {
      drill: '6,000 clients connecting at once',
      before: '6,111 per second',
      after: '7,995 per second',
    },
    {
      drill: '3,000 connected devices at 2,000 msg/s; an edge and a core killed, another edge restarted',
      before: '89 acknowledged messages lost',
      after: '79 acknowledged messages lost',
    },
  ],
} as const;
