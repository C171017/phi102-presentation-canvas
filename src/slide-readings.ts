import type { slides } from './slide-content';

type SlideHeading = Exclude<(typeof slides)[number]['members'][0], `pairing-${string}` | 'pairings-heading'>;
type Reading = { section: string; body: string };

// Plain-language adaptation of Greco’s chapter, organized by canvas heading ID.
export const slideReadings = {
  'contemporary-heading': {
    section: '§ Introduction',
    body: `
      <p>
        Imagine I say, “I know I locked the front door.” On a normal morning, remembering that I turned the
        key might be enough for that claim to be true. During a break-in investigation, the same words might
        make a stronger claim, one that requires me to rule out the possibility that I’m mixing up this
        morning with yesterday. My evidence can stay exactly the same across the two conversations. What
        changes, on the view philosophers now call <strong>contextualism</strong>, is what I’m claiming when I
        say “I know.”
      </p>
    `,
  },
  'flexible-heading': {
    section: '§ Introduction',
    body: `
      <p>
        An older view also went by “contextualism.” It asks <strong>what we can take as a starting point when
        deciding what to believe</strong>. On a normal morning, I can take my memory at face value and use it
        as a reason to believe I locked up. If we’re checking whether that memory is accurate, it would be
        circular to rely on the memory itself to prove it’s accurate. I might start with the security footage.
      </p>
      <p>
        Greco calls the older idea <strong>flexible foundationalism</strong>. It shares with traditional
        foundationalism the idea that some beliefs can be justified without needing further beliefs to support
        them. The flexible part is that which beliefs can serve as foundations depends on the context. David
        Annis and Michael Williams used “contextualism” for this family of views, whose roots are often traced
        to C. S. Peirce, John Dewey, and Ludwig Wittgenstein.
      </p>
    `,
  },
  'aim-motivations': {
    section: '§§1–2 · Chapter overview',
    body: `
      <p>
        Say you’re unsure whether you locked up. If you also doubt your memory of turning the key, pointing to
        that memory just moves the doubt back a step.
      </p>
      <p>
        Greco asks where a chain of reasons can reasonably stop. His answer depends on which doubts are in
        play.
      </p>
    `,
  },
  'aim-versions': {
    section: '§3 · Chapter overview',
    body: `
      <p>
        Greco explores four ways to explain how a belief’s role as a starting point can depend on the
        situation.
      </p>
    `,
  },
  'aim-applications': {
    section: '§4 · Chapter overview',
    body: `
      <p>
        Greco uses this idea to ask a question about our reasons. If you have good grounds to believe
        something, do you also have good grounds to believe that you do? He states the Access principle,
        asks which facts fix those first-order grounds, and considers how the relevant facts can shift.
      </p>
    `,
  },
  'regress-problem': {
    section: '§1 · Regresses and foundations',
    body: `
      <p>
        Say I tell you I locked the front door. You ask, “How do you know?” I say, “I remember turning the
        key.” Then you ask, “What makes you think you’re remembering it right?” Whatever reason I give, you
        can ask what backs <em>that</em> up.
      </p>
      <p>
        That’s the <strong>regress problem</strong>. If every reason needs another reason behind it, how do we
        ever get good grounds for believing anything? Greco starts with four familiar answers.
      </p>
      <h2>Four answers</h2>
      <ul>
        <li><strong>Skepticism.</strong> We never get there. No belief is justified.</li>
        <li>
          <strong>Infinitism.</strong> Every reason has another reason behind it. The chain goes on forever
          without repeating.
        </li>
        <li>
          <strong>Coherentism.</strong> The beliefs get their support from how they fit together. If you draw
          that support as a chain, as Greco does here, it eventually loops back.
        </li>
        <li>
          <strong>Foundationalism.</strong> The chain stops at beliefs that can support other beliefs without
          needing support from further beliefs. Greco calls these beliefs <em>foundationally justified</em>.
        </li>
      </ul>
      <h2>What makes each answer hard to accept?</h2>
      <p>
        Each answer has a cost. Surely we have good grounds for at least some beliefs. An endless chain looks
        like a defense you could never finish. A circle looks like asking a belief to back itself up. And if
        the chain stops, why is that particular belief a good place to stop? Many philosophers find
        foundationalism the most promising answer anyway. They still owe us an account of where it’s
        reasonable to stop.
      </p>
    `,
  },
  'dilemma-heading': {
    section: '§1 · Regresses and foundations',
    body: `
      <h2>Descartes’s search for certainty</h2>
      <p>
        Descartes looked for starting points that would hold up against any possible doubt. If I’m unsure
        whether I locked the door and I also doubt my memory of turning the key, pointing to that memory just
        moves the doubt back a step. Clear security footage might settle the matter for me. But even that
        footage is open to doubt. Someone could ask whether the timestamp is right. Very few beliefs meet
        Descartes’s standard, so it’s hard to see how they could support everything we ordinarily have good
        reason to believe.
      </p>
      <h2>More room for everyday beliefs</h2>
      <p>
        More moderate foundationalists let ordinary beliefs, such as beliefs based on what you see, serve as
        starting points even though your eyes sometimes fool you. That gives us many more places to stop.
        Greco’s worry is that the looser rule leaves us without a clear explanation of why a stopping point
        can settle a doubt. Suppose you’re already wondering whether the light makes the paint look darker
        than it really is. How much help is “Well, it looks dark”?
      </p>
    `,
  },
  'undoubted-heading': {
    section: '§1 · Regresses and foundations',
    body: `
      <p>
        Flexible foundationalism asks which doubts are in play here and now. Clear footage can settle whether
        I locked up while everyone takes the timestamp for granted. Once the timestamp itself comes under
        serious question, the footage loses that role.
      </p>
      <p>
        A starting point can be <strong>open to doubt in principle and still free from doubt in this
        inquiry</strong>. What makes a doubt count in a particular inquiry? The next three approaches give
        different answers.
      </p>
    `,
  },
  'route-social-heading': {
    section: '§2.1 · Social dimensions of justification',
    body: `
      <p>
        Think about what happens when someone challenges a belief of yours. You offer a reason, and they can
        ask questions about it. On this approach, a belief is justified if a defense is available in
        principle, even if you’d need time to put it into words.
      </p>
      <p>
        In real conversations, people expect the reasons to end somewhere. A child can keep asking “Why?” long
        after the adults think the question has been answered. Where it’s reasonable to stop can depend on
        who’s listening. Your roommate might accept “I remember locking it.” A detective might ask how you
        know you’re remembering the right morning.
      </p>
      <h2>Whose objections count?</h2>
      <p>
        David Annis builds a theory around that difference. In a given situation, your community’s standards
        determine which group of people within it sets the bar. Annis calls them the appropriate
        <strong>objector group</strong>. A belief is justified if it can be defended against the objections
        they <em>would</em> raise, even if nobody actually raises them. If the group would accept the belief
        without asking for any further reason, Annis calls it <strong>contextually basic</strong>. Greco
        treats that as a kind of flexible foundation.
      </p>
      <h2>What if the whole community is wrong?</h2>
      <p>
        Imagine an entire community takes it for granted that a horoscope can tell you whom to trust. Their
        belief could be false, and they could also be making a mistake by accepting it without evidence. If
        everyone in the community would let the claim pass, any group Annis picks from that community would
        let it pass too. His account would make the belief a foundation even in a case where the community is
        wrong to take it for granted.
      </p>
    `,
  },
  'route-hinges-heading': {
    section: '§2.2 · Hinges',
    body: `
      <p>
        You can’t see the light from where you’re standing, so you ask a friend what color it is. They say,
        “It’s green.” For that answer to settle the question, you take several things for granted. Your friend
        understands you, is answering honestly, and can reliably tell green from other colors.
      </p>
      <p>
        Wittgenstein calls these starting points <strong>hinges</strong>. A door can swing around a hinge
        because the hinge holds steady. In the same way, you can investigate one question because you’re
        holding others steady. On this reading, taking <em>something</em> for granted is what makes inquiry
        possible at all. Some interpreters call the permission to rely on a hinge an <em>entitlement</em>.
      </p>
      <h2>When a hinge becomes the question</h2>
      <p>
        Now suppose you’re testing whether your friend can reliably identify green. This time you take the
        colors on the test cards as given and use them to check your friend’s answers. Whether your friend can
        tell green from other colors was settled for the purposes of the first inquiry. It’s the open question
        in the second. Each inquiry needs some hinges, and different inquiries can use different ones.
      </p>
    `,
  },
  'route-knowledge-heading': {
    section: '§2.3 · Knowledge and belief',
    body: `
      <h2>Starting from what you know</h2>
      <p>
        You can also arrive at flexible foundationalism by combining theories about knowledge or belief.
        Timothy Williamson holds that <strong>your evidence is exactly what you know</strong>, a view often
        written <strong>E = K</strong>. Say you see a puddle under the sink and know it’s there. That
        knowledge can be evidence for a leak. It can do the job even if your knowledge of the puddle comes
        straight from seeing it, without any argument from other beliefs.
      </p>
      <p>
        Now pair E = K with a theory on which what counts as knowledge can vary with the situation. Williamson
        rejects that second idea. Greco is exploring what happens if you accept both. Say someone raises a
        serious doubt you can’t answer about whether what you saw was really water. In a conversation that
        takes that doubt seriously, “You know there’s a puddle” may count as false. On the combined view,
        there being a puddle also drops out of what counts as your evidence in that conversation.
      </p>
      <h2>Starting from what you believe</h2>
      <p>
        Gilbert Harman starts from a different idea. All your beliefs form your foundation. That foundation
        becomes flexible if you add Roger Clarke’s idea that what you count as believing can depend on what
        you’re doing or what conversation you’re in. In casual conversation, you might take a friend’s word
        that the last train leaves at eleven. When you’re planning how to get home, the very same information
        might leave you undecided. On Clarke’s account, the task can affect whether you count as believing the
        train leaves at eleven. On Harman’s account, that would affect whether that belief is part of your
        foundation.
      </p>
    `,
  },
  'versions-map-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        Section 2 asks why foundations might vary. Section 3 asks whose context matters and how. Greco first
        develops four pairings by applying two views to the social and hinge routes.
      </p>
      <ul>
        <li><strong>Community norms (§2.1).</strong> Greco sketches sensitive invariantist and contextualist
          versions. The problem of disagreement then motivates looking at relativism and expressivism.</li>
        <li><strong>Hinges (§2.2).</strong> Greco sketches sensitive invariantist and contextualist versions
          of this route too.</li>
        <li><strong>Knowledge or belief at the base (§2.3).</strong> Greco pairs E = K with a flexible theory
          of knowledge, explicitly listing sensitive invariantism, contextualism, and relativism there.
          Section 3 also links some relativist and expressivist accounts of knowledge to accounts of
          foundational justification. Harman’s separate pairing is with sensitivism about belief.</li>
      </ul>
    `,
  },
  'si-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        When two speakers call the same belief foundationally justified, they make the same claim. On
        Greco’s reading of Annis, whether that claim is true depends in part on whose belief it is and
        what the relevant objectors from <em>that person’s community</em> would challenge.
        Community norms do the work that practical stakes do in familiar sensitive invariantist views of knowledge.
      </p>
      <h2>Can a community’s standards be wrong?</h2>
      <p>
        Suppose everyone in my community accepts astrology. For Annis, a belief the relevant objectors
        would all let pass can count as foundational. Greco asks whether the community itself could be
        mistaken in letting it pass.
      </p>
    `,
  },
  'hinges-si-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        On this version of the hinge route, the <em>believer’s inquiry</em> helps determine which beliefs
        are foundational. A belief can serve as a hinge when the believer needs to hold it fixed to pursue
        that inquiry. Different speakers who call that belief foundational make the same claim.
      </p>
      <p>
        Take Wittgenstein’s color example from §2.2. To learn which color a witness sees, you take for granted
        that the witness understands English. If you switch to testing whether the witness understands English,
        that belief is now itself in question. Changing the inquiry can change whether the belief qualifies
        as a foundation.
      </p>
    `,
  },
  'ctx-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        Greco sketches a contextualist version of Annis in which the norms of the <em>speaker’s
        epistemic community</em> help determine what the speaker claims. Two speakers can use the same
        sentence about the same belief and make different claims if their communities supply different standards.
      </p>
      <h2>Clues in everyday speech</h2>
      <p>
        Both contextualist proposals face a difficulty. People rarely use the technical phrase “foundationally
        justified.” Ordinary speech can still show what people treat as a starting point. “It must be cold
        outside” suggests I’ve worked it out from a clue, such as seeing people walk by in thick coats. If I
        say “I have a toothache” and you ask what makes me think so, I might just say “Oh, come on.” My reply
        suggests I take my belief that I have a toothache to stand on its own. A contextualist could study
        what makes responses like these sound natural in some settings and out of place in others.
      </p>
      <h2>Criticizing a community’s standards</h2>
      <p>
        Greco also sketches a contextualist view inspired by the moral analogy of <strong>speaker
        relativism</strong>. Here the speaker reports her own commitment to accepting the belief as a
        starting point. This gives her room to criticize a community that accepts astrology. Greco uses
        that move to set up the problem of disagreement.
      </p>
    `,
  },
  'hinges-ctx-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        On the contextualist hinge view Greco sketches, the <em>inquiry the speaker is engaged in</em>
        helps determine which claim the speaker makes. In the color example, calling the belief that the
        witness understands English foundational can mean that her English is safe to assume for the color
        inquiry. In a test of her English, the same words would make a claim about what can be assumed in
        that inquiry.
      </p>
      <p>
        Greco presents this as a sketch. “Foundationally justified” is a technical phrase, so he suggests
        looking for ordinary remarks that indirectly convey which beliefs people are taking as foundations.
      </p>
    `,
  },
  'paper-disagreement-responses': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        Suppose that calling a belief foundational reports the speaker’s own commitment to treating it that way. If you say “I’m hungry” and I say
        “I’m not hungry,” both statements can be true. You’re talking about your hunger and I’m talking about
        mine. Now suppose you say “We can take that claim about horoscopes for granted,” and I say “We can’t.”
        If you’re reporting which starting points you accept and I’m reporting which ones I accept, both
        statements can still be true. Yet we seem to disagree about which beliefs deserve to be taken for
        granted.
      </p>
      <p>That’s the <strong>problem of disagreement</strong>.</p>
      <h2>Two possible responses</h2>
      <p>
        Some philosophers take it as a reason to try <strong>expressivism</strong>. Think of the difference
        between saying “I’m in favor of this” and actually voting for it. On an expressivist view, calling a
        belief a good starting point works more like casting the vote. You’re endorsing its use, and that
        endorsement can clash with someone else’s rejection.
      </p>
      <p>
        Another option is <strong>relativism</strong>. Two people can assess the very same claim by different
        standards, and its truth can depend on the standards of the person assessing it.
      </p>
      <p>
        Greco connects both options back to the knowledge route. On some accounts, a relativist or
        expressivist view of knowledge is itself a view of foundational justification. He leaves open
        which account works best.
      </p>
    `,
  },
  'access-heading': {
    section: '§4.1 · Access and foundationalism',
    body: `
      <p>Peter is hosting a party. Consider two thoughts Justine might have.</p>
      <ol>
        <li>“The party starts at 7.”</li>
        <li>“I’m justified in believing the party starts at 7.”</li>
      </ol>
      <p>
        The first thought is about the party. The second is about Justine’s grounds for believing the first.
        <strong>Access</strong> says that if she has grounds to believe the first, she also has grounds to
        believe the second. She can have those grounds even if she never stops to reflect on them.
      </p>
      <h2>When doubt about your reasons spreads</h2>
      <p>
        Now consider a bus ride home. Suppose you start to wonder whether your evidence is good enough to believe the bus runs after midnight. It
        would make sense to become less confident that the bus actually does. Doubt about your grounds can
        carry over to the belief itself.
      </p>
      <p>
        That creates a problem for a foundationalist who rejects Access. Suppose “The schedule lists a 12:30
        bus” is a starting point for you, but you have no good grounds to think you’re justified in believing
        it. If you reason carefully, Greco suggests, you may end up doubting whether the schedule really lists
        that bus. You’d be relying on a starting point that you also have reason to doubt. That gives Greco a
        reason to want at least a limited form of Access. For beliefs that are justified as starting points,
        you should also have grounds to believe they’re justified that way.
      </p>
    `,
  },
  'home-heading': {
    section: '§§4.1–4.2 · What fixes first-order justification?',
    body: `
      <p>
        Access tells us what follows once Justine has grounds for a belief. What gives her
        grounds to believe the party starts at seven in the first place?
      </p>
      <p>
        In Greco’s party example (§4.2), everyone takes for granted that Peter is a reliable host
        and that Justine heard him clearly. If he said seven, she has grounds to believe seven.
        If he said eight, she has grounds to believe eight. Hold his words fixed, and her
        first-order justification stays the same across the possibilities under discussion.
        What Peter said is the <strong>local supervenience base</strong> for that judgment.
      </p>
      <h2>Could one base work everywhere?</h2>
      <p>
        In §4.1, Greco explains why a defender of Access might want a base the subject can
        always know. Smithies looks to facts about one’s own mind that are accessible by
        introspection. Williamson calls such a realm a <strong>cognitive home</strong>.
      </p>
      <p>
        Now suppose Peter might have mumbled. If his exact words still determine what
        Justine should believe, she might be unable to tell what she has grounds to believe.
        Why keep those words fixed as the base once her hearing is in doubt?
      </p>
    `,
  },
  'mobile-heading': {
    section: '§4.2 · Access and flexible foundationalism',
    body: `
      <p>
        Compare two conversations about the same party. In the first, we take for granted
        that Justine heard Peter clearly. What he said settles what she has grounds to believe.
        In the second, we take seriously the possibility that he mumbled. His exact words
        can no longer do that job on their own.
      </p>
      <p>
        Greco suggests that Justine might remember Peter’s email, recall when his parties
        usually start, or know what her best guess is. For the illustration, suppose she
        remembers an email giving the time as seven. Her first-order justification still
        supports seven, while the fact that fixes it has changed.
      </p>
      <h2>Why this helps with Access</h2>
      <p>
        The flexible foundationalist proposes that in each context, Justine counts as being
        in a position to know the facts in the local base. She can identify what supports her
        belief about the party time, even as the relevant facts change. Greco calls this a
        <strong>cognitive mobile home</strong>. It illustrates how we might defend Access
        within each context. A full defense would also have to explain how access to those
        facts gives her access to what they justify.
      </p>
    `,
  },
} satisfies Record<SlideHeading, Reading> & Record<string, Reading>;

export function readingFor(heading: (typeof slides)[number]['members'][0], anchor?: string): Reading {
  const readings: Record<string, Reading> = slideReadings;
  if (anchor === 'paper-flexible-knowledge' || anchor === 'paper-belief-at-the-base') {
    return slideReadings['route-knowledge-heading'];
  }
  return readings[heading] ?? readings[anchor ?? ''] ?? { section: '§§2.3–3', body: '' };
}
