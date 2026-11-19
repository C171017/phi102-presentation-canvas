import type { slides } from './slide-content';

type SlideHeading = (typeof slides)[number]['members'][0];

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
        something, do you also have good grounds to believe that you do?
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
        Two people can use the same words, “That belief is a good starting point,” in different situations.
        Greco asks where the differences between situations show up.
      </p>
      <ul>
        <li><strong>Sensitive invariantism.</strong> Which beliefs actually qualify as starting points.</li>
        <li><strong>Contextualism.</strong> What the speaker claims.</li>
        <li><strong>Expressivism.</strong> What attitude the speaker expresses.</li>
        <li><strong>Relativism.</strong> How someone judges the claim.</li>
      </ul>
    `,
  },
  'si-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        <strong>Sensitive invariantism</strong> locates the difference in the situation of the <em>person
        whose belief we’re talking about</em>. Think back to the last train. On this view, if two people tell
        you “You know the train leaves at eleven,” they’re making the same claim. Whether it’s true can depend
        on what’s at stake for you. Applied to foundations, the idea is that your circumstances can affect
        which of your beliefs qualify as starting points. On Annis’s view, what matters includes the standards
        of your community. On a version of the hinge view, it includes the question you’re investigating and
        what you need to take for granted to investigate it.
      </p>
      <h2>Can a community’s standards be wrong?</h2>
      <p>
        The horoscope example raises another question. Can we criticize the very standards a community uses to
        decide which beliefs need evidence? Greco draws a parallel with morals. A whole community could
        approve of humiliating children and still be wrong to approve of it. Likewise, a whole community could
        take horoscopes for granted and still be wrong to give them a pass.
      </p>
    `,
  },
  'ctx-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        <strong>Contextualism</strong>, in its modern sense, locates the difference in what the speaker
        claims. Two speakers talking about the same person’s belief could make different claims depending on
        their own communities or the questions they’re investigating. The trouble is finding ordinary examples
        of this. People say “I know” all the time. The phrase “foundationally justified” mostly shows up in
        philosophy.
      </p>
      <h2>Clues in everyday speech</h2>
      <p>
        Still, ordinary speech can show what people are treating as a starting point. “It must be cold
        outside” suggests I’ve worked it out from a clue, such as seeing people walk by in thick coats. If I
        say “I have a toothache” and you ask what makes me think so, I might just say “Oh, come on.” My reply
        suggests I take my belief that I have a toothache to stand on its own. A contextualist could study
        what makes responses like these sound natural in some settings and out of place in others.
      </p>
      <h2>Criticizing a community’s standards</h2>
      <p>
        One version of contextualism gives the speaker room to criticize the community. On a simple moral view
        called <strong>speaker relativism</strong>, calling an action wrong means saying that I disapprove of
        it. I can call an action wrong even when my community approves of it. Apply that idea to foundations.
        When I call a belief a good starting point, I’m saying that I’m prepared to let people use it as a
        reason without asking them to back it up. I can say “They’re wrong to take horoscopes for granted”
        because I’m stating where I stand, even if the whole community takes a different stand.
      </p>
    `,
  },
  'disagree-heading': {
    section: '§3 · Relations to recent debates',
    body: `
      <p>
        It can be hard to see where the disagreement is on this account. If you say “I’m hungry” and I say
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
        standards, and its truth can depend on the standards of the person assessing it. Greco leaves open
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
    section: '§4.1 · Access and foundationalism',
    body: `
      <p>
        How could such access be possible? It can be true that it’ll rain tomorrow even if your forecast says
        it’ll be sunny. In most areas of life, the evidence we have can lead us away from what’s true. Access
        says something unusual about our own justification. Whenever it’s true that you have good grounds for
        a belief, you have good grounds to believe that fact about yourself.
      </p>
      <p>
        One tempting answer focuses on the facts that fix what you have grounds to believe. Greco calls these
        facts the <strong>supervenience base</strong>. If all the facts in the base stay the same, what you’re
        justified in believing stays the same too. Imagine, for the sake of argument, that whether you have
        good grounds to believe something depended on whether it rains tomorrow. A misleading forecast could
        then mislead you about your own grounds. That’s why a defender of Access might look for a base made up
        entirely of facts about which your evidence can never mislead you.
      </p>
      <h2>A way to know your own grounds</h2>
      <p>
        Declan Smithies takes this approach. He says justification depends on special facts about your own
        mind. If one of those facts is true, looking inward gives you grounds to believe it. If it’s false,
        looking inward gives you no grounds to believe it. Then you can work out, by reasoning alone, what
        those mental facts give you grounds to believe.
      </p>
      <p>
        That asks us to believe in what Timothy Williamson calls a <strong>cognitive home</strong>, a range of
        facts you can always know if you pay close enough attention. That range would have to be large enough
        to fix everything you’re justified in believing. That’s a lot to ask of our ability to know our own
        minds. Greco suggests a cognitive home that can shift with the situation. He calls it a <strong>mobile
        home</strong>.
      </p>
      <p>
        Now suppose Peter said “7,” but Justine couldn’t hear him clearly. If his actual words still fix
        what she should believe, how could she tell what she has grounds to believe? An externalist can
        allow that gap. Someone defending Access owes us an explanation.
      </p>
    `,
  },
  'mobile-heading': {
    section: '§4.2 · Access and flexible foundationalism',
    body: `
      <p>
        Peter is hosting a party and gave Justine a start time. Take it for granted that he’s trustworthy and
        she heard him clearly.
      </p>
      <ul>
        <li>If he told her seven, she has good grounds to believe the party starts at seven.</li>
        <li>If he told her eight, she has good grounds to believe it starts at eight.</li>
      </ul>
      <p>
        With those assumptions in place, what Peter said settles what Justine has grounds to believe. Since
        she knows what he said, she can tell whether her grounds point to seven or eight.
      </p>
      <h2>If Peter mumbled</h2>
      <p>
        Now question those assumptions one at a time. If Peter likes giving people the wrong time as a joke,
        his words may be poor evidence even if Justine heard them clearly. Suppose instead we take seriously
        the possibility that Peter is trustworthy and simply mumbled. If we still say his exact words fix what
        Justine has grounds to believe, we’re making her grounds depend on a fact she may have no way to know.
      </p>
      <p>
        Greco thinks we’d look to other facts to settle what Justine has grounds to believe. Maybe she
        remembers Peter’s email or knows when his parties usually start. Maybe she knows that her best guess
        is that he said seven. A clear email might give her grounds to believe it starts at seven. A hunch
        might only give her grounds to lean toward seven. Either way, what it’s reasonable for her to believe
        can depend on facts she’s in a position to know.
      </p>
      <h2>What fixes Justine’s grounds?</h2>
      <p>
        In the first conversation, keep the assumptions about Peter’s honesty and Justine’s hearing fixed.
        Changing what time Peter said changes what time Justine has grounds to believe. Keeping his words the
        same keeps the answer the same. That’s what makes his words a <strong>local</strong> supervenience
        base for this question. They fix the answer across the possibilities we’re taking seriously in that
        conversation. Greco’s proposal is that <strong>within each context, the facts that do this job must be
        facts the person counts as being in a position to know</strong>.
      </p>
      <p>
        Those facts make up Justine’s cognitive home for that context. In one conversation it can include what
        Peter said. When we take the possibility that he mumbled seriously, it might include what his email
        said. In the diagram, suppose the email also says seven. Her answer stays the same while
        the grounds for that answer shift. What changed between those conversations can be as simple as which possibilities <em>we</em>
        take seriously. A further doubt about whether Justine remembers the email could move the home again.
      </p>
      <h2>Access within a context</h2>
      <p>
        The result is a version of Access that works context by context. If Justine has grounds to believe the
        party starts at seven, she also has grounds to think she’s justified in believing it starts at seven.
        Both judgments are made within the same context. The party case illustrates the proposal. A full
        defense would still have to show that a suitable set of facts is available in each context and that
        access to those facts gives you access to what they justify.
      </p>
    `,
  },
  'conclusion-heading': {
    section: '§5 · Conclusion',
    body: `
      <p>
        For a flexible foundationalist, chains of reasons can stop, and where they can stop depends on the
        context. Different versions appeal to the people you’re answering to, the question you’re trying to
        settle, or what you know or believe in the situation.
      </p>
      <p>
        Greco’s final suggestion is that this flexibility can help explain how you can tell when you have good
        grounds for a belief. The facts that fix your grounds can shift when different doubts are taken
        seriously.
      </p>
    `,
  },
} satisfies Record<SlideHeading, { section: string; body: string }>;
