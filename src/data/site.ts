// One place for anything that appears in more than one component, so the
// page and the metadata cannot drift apart.
export const site = {
  name: 'mast',
  tagline: 'Multi-tenant MQTT broker built on core NATS',
  blurb: 'One binary, from an edge box to a clustered fleet.',
  // The sentence under the h1. The tagline says what it is; this says why
  // someone with a fleet would care, in the terms they would compare on.
  pitch: 'Tenant isolation, MQTT 5 and free clustering, without the JVM or a licence key. Sleeping devices keep their messages when nodes die.',
  repo: 'https://github.com/mastmq/mast',
  org: 'https://github.com/mastmq',
  migrationGuide:
    'https://github.com/mastmq/docs/blob/main/guides/migrating-from-emqx.md',
  parityIssues:
    'https://github.com/mastmq/mast/issues?q=is%3Aissue+is%3Aopen+label%3Aparity',
  deliveryGuide:
    'https://github.com/mastmq/docs/blob/main/guides/delivery-guarantees.md',
  releases: 'https://github.com/mastmq/mast/releases',
  chart: 'https://github.com/mastmq/charts',
  collection: 'https://github.com/mastmq/ansible',
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
      featured: true,
      before: '10,000 of 10,000 lost',
      after: 'none lost',
    },
    {
      drill: '5,000 sleeping devices, 100,000 messages, a core and two edges killed',
      featured: true,
      before: 'not run',
      after: 'none lost, 9 runs of 9',
    },
    {
      drill: '300,000 sleeping devices held by every core, then 2,000 more woken among them',
      featured: true,
      before: 'not run',
      after: 'held in 12s at about 650 MB a core; 10,000 of 10,000 delivered',
    },
    {
      drill: '1,500 subscribers to 2,000 retained topics at once',
      featured: true,
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

// The three numbers under the masthead. Each is lifted from a drill row
// above and links to it, so the headline cannot claim more than the table.
export const stats = [
  { value: '300,000', label: 'sleeping devices held by three cores, at about 650 MB a core' },
  { value: '0 lost', label: 'of 100,000 messages, a core and two edges killed, 9 runs of 9' },
  { value: '7,995/s', label: 'clients connecting at once, on one laptop' },
] as const;

// The in-page sections, in page order. The masthead nav is built from the
// ones with a `nav` label, so an anchor cannot point at a section that was
// renamed or removed. The first and the last have none: the first is what
// the page opens on, and the repositories are in the footer too.
export const sections = {
  why: { id: 'why', title: 'Why it exists' },
  design: { alt: true, id: 'design', nav: 'Design', title: 'How it is put together' },
  architecture: { id: 'architecture', nav: 'Architecture', title: 'Where a message goes' },
  run: { alt: true, id: 'run', nav: 'Run it', title: 'Run it' },
  results: { id: 'under-fire', nav: 'Test results', title: 'Under fire' },
  emqx: { alt: true, id: 'emqx', nav: 'From EMQX', title: 'Replacing EMQX' },
  status: { id: 'status', nav: 'Status', title: 'Where the project is' },
  repos: { alt: true, id: 'repos', title: 'Repositories' },
} as const;

export const why = {
  lede: 'Every open-source MQTT broker that does real multi-tenancy makes you give something up.',
  // This line claimed per-tenant limits before the broker had them, and was
  // cut back to isolation until mastmq/mast#32 added them: connections
  // across the cluster, a publish rate per node and each sleeping device's
  // queue. The status section says which release carries them.
  mast: 'MQTT 5 with shared subscriptions, tenant isolation with per-tenant limits, free clustering, no JVM, and a single binary you can run standalone at a customer site.',
} as const;

export const architecture = {
  lede: 'Edges speak MQTT and keep nothing; each one joins the cores as a NATS leaf node, an ordinary outbound connection. Cores keep everything, in four replicated JetStream assets, whatever the number of devices.',
} as const;

// A line of a shown code block: the code, and an optional comment drawn
// muted after it. Kept as data so the snippets sit with the rest of the
// copy instead of as hand-escaped spans in the markup.
export type CodeLine = { code?: string; comment?: string };

export const run = {
  lede: 'One binary, three roles. No flags are needed for the common case; the roles exist for when you outgrow it.',
  roles: [
    { comment: '# all-in-one: MQTT and storage in one process, no cluster' },
    { code: 'mast' },
    {},
    { comment: '# or split the tiers once the MQTT side needs to scale' },
    { comment: '# independently of Raft' },
    { code: 'mast --role=core   ', comment: '# Raft and the KV buckets, stable peers, a volume' },
    { code: 'mast --role=edge   ', comment: '# MQTT listeners, stateless, joins core as a leaf node' },
  ] satisfies CodeLine[],
  note: 'You do not need the split until you are big. Up to roughly ten nodes, run every process identical and let them mesh.',
  // Only the ways that are published and tested. The container one was
  // once left out on the guess that a nonroot image could not write the
  // default ./data; it can, and a stored QoS 1 publish proved it.
  install: [
    {
      title: 'A container',
      url: 'https://github.com/mastmq/mast/pkgs/container/mast',
      link: 'Image',
      body: 'All-in-one, with every client in one tenant: right for a laptop, wrong for anything reachable by someone else.',
      lines: [{ code: 'docker run -p 1883:1883 ghcr.io/mastmq/mast' }],
    },
    {
      title: 'A binary',
      url: site.releases,
      link: 'Releases',
      body: 'Static Linux builds for amd64 and arm64, with a checksums file.',
      // The archive name carries the version, so releases/latest/download
      // cannot name it; the API's latest release can.
      lines: [
        { comment: '# the latest release, linux/amd64' },
        { code: 'curl -sL https://api.github.com/repos/mastmq/mast/releases/latest \\' },
        { code: "  | grep -o 'https://[^\"]*linux_amd64.tar.gz' | xargs curl -sL | tar xz" },
        { code: './mast' },
      ],
    },
    {
      title: 'Kubernetes',
      url: site.chart,
      link: 'Helm chart',
      body: 'Standalone or clustered, with the core tier as a StatefulSet; HTTP or JWT auth, and TLS from a cert-manager Secret.',
      lines: [{ code: 'helm install mast oci://ghcr.io/mastmq/charts/mast' }],
    },
    {
      title: 'Virtual machines',
      url: site.collection,
      link: 'Ansible collection',
      body: 'systemd units on any amd64 or arm64 host; the inventory group picks the role.',
      lines: [
        { code: 'ansible-galaxy collection install \\' },
        { code: '  git+https://github.com/mastmq/ansible.git' },
        { code: 'ansible-playbook -i inventory.yml mastmq.mast.site' },
      ],
    },
  ] satisfies { title: string; url: string; link: string; body: string; lines: CodeLine[] }[],
} as const;

export const results = {
  note: 'Two things did not get better. Every core now reads every QoS 1 and 2 message to find the ones a sleeping device needs, which roughly doubles core CPU under QoS 1 load and is where the higher p99 comes from. And a device that is still connected when its edge is killed outright loses what is published to it until it reconnects elsewhere; a graceful restart loses nothing.',
} as const;

export const emqx = {
  lede: 'mast speaks EMQX v5’s HTTP auth wire, so an auth service written for EMQX works unchanged.',
  config: [
    { code: '[auth]' },
    { code: 'mode = "http"' },
    {},
    { code: '[auth.http]' },
    { code: 'wire = "emqx"          ', comment: '# EMQX’s request and response shape' },
    { code: 'authn_url = "http://soteria:9999/v2/auth"' },
    { code: 'authz_url = "http://soteria:9999/v2/acl"' },
    { code: 'on_error = "deny"      ', comment: '# EMQX_AUTHORIZATION__NO_MATCH' },
  ] satisfies CodeLine[],
  note: 'Topics reach the authorization endpoint unmounted, so existing ACL rules keep working. The migration guide has the full mapping and the four traps that actually fired doing it: is_superuser, multipath TCP on OpenShift, Helm’s map merging, and SCC uid ranges.',
} as const;

export const status = {
  lede: 'Early, and honest about it. The broker runs, moves messages across a cluster with tenant isolation, honours QoS 0 through 2, replays retained messages, delivers wills, and carries a persistent session from one node to another.',
  gaps: 'Gaps are tracked as issues rather than described as a roadmap. The parity label is what an MQTT client is entitled to assume and does not yet get. Per-tenant limits, on main for the release after v0.3.2, cap a tenant’s connections across the cluster, its publish rate on each node and what is kept for each of its sleeping devices; the rate of new connections, inbound bytes and stored sessions are not capped yet. There is no dashboard and no management API, and no plan for a rule engine or data bridges.',
  limit: 'Know the limits before you build on it. QoS 1 and 2 hold across a cluster: a publish is stored on a replicated stream before it is acknowledged, and a node cut off from the core catches up when it returns. Two things are still best-effort: shared subscriptions whose members span nodes, and a message a node had taken when it died, which includes one for a device still connected to an edge that is killed outright.',
} as const;
