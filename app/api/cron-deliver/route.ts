import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Resend } from "resend";
import { generateSoulmateSketch } from "@/lib/ai-generate";

// ── Email templates keyed by reading_id ──────────────────────────────────────

function buildEmail(order: {
  reading_id: string;
  answers: Record<string, string>;
  delivery_type: string;
  image_url?: string | null;
}): { subject: string; html: string } {
  const { reading_id, answers, delivery_type, image_url } = order;
  const sign = answers.sun_sign || "your sign";
  const element = answers.element || "your element";
  const isExpress = delivery_type === "express";

  const wrap = (inner: string) => `
    <div style="font-family: Georgia,serif; max-width:600px; margin:0 auto; background:#0a0510; color:#ede4d8; padding:40px 32px; border-radius:12px;">
      <p style="font-size:11px; letter-spacing:0.4em; text-transform:uppercase; color:#c084fc; margin:0 0 20px;">PerfectLove</p>
      ${inner}
      <hr style="border:none; border-top:1px solid #2d1f45; margin:36px 0 20px;" />
      <p style="font-size:12px; color:#7a6d8a; text-align:center;">With love, The PerfectLove Team ✦</p>
    </div>`;

  const p = (t: string) => `<p style="font-size:15px; line-height:1.7; color:#b8a9c4; margin:0 0 14px;">${t}</p>`;
  const h1 = (t: string) => `<h1 style="font-size:26px; font-weight:normal; color:#ede4d8; margin:0 0 8px;">${t}</h1>`;
  const h2 = (t: string) => `<h2 style="font-size:18px; font-weight:normal; color:#f0c050; margin:26px 0 10px;">${t}</h2>`;
  const meta = `<p style="font-size:11px; color:#7a6d8a; margin:0 0 28px;">${sign} · ${element}${isExpress ? " · Express" : ""}</p><hr style="border:none; border-top:1px solid #2d1f45; margin:0 0 28px;" />`;

  switch (reading_id) {
    case "soulmate-sketch":
      return {
        subject: isExpress ? "⚡ Your Soulmate Sketch — Express Delivery" : "✨ Your Soulmate Sketch is Ready",
        html: wrap(
          h1("Your Soulmate Sketch") + meta +
          (image_url
            ? `<div style="text-align:center; margin-bottom:28px;"><img src="${image_url}" alt="Your Soulmate Sketch" style="max-width:100%; border-radius:10px; border:1px solid #2d1f45;" /></div>`
            : "") +
          p(`Based on your <strong>${sign}</strong> energy and <strong>${element}</strong> resonance, this portrait channels the soul drawn to yours. The presence you see here will feel instantly familiar.`) +
          p("They carry a quiet strength — the kind that makes you feel seen without needing to explain yourself. Keep this image with you. You'll recognize them when the moment comes.")
        ),
      };

    case "soulmate-name-initials":
      return {
        subject: "✨ The Initials of Your Soulmate Revealed",
        html: wrap(
          h1("Name Initials of Your Soulmate") + meta +
          p(`The cosmic patterns within your ${sign} chart have illuminated two letters that carry the energetic imprint of the soul meant for you.`) +
          h2("The Initials") +
          p(`<strong style="font-size:32px; color:#c084fc; letter-spacing:0.15em;">R. A.</strong>`) +
          p(`These initials carry a ${element} frequency — grounded yet flowing, familiar yet mysterious. You may have already encountered them without realizing their significance.`) +
          h2("Where to Watch") +
          p("The letters will appear on street signs, in names introduced at gatherings, in books that fall open at the right page. When you see them together — pause. The universe is confirming you're in the right place.")
        ),
      };

    case "soulmate-zodiac":
      return {
        subject: "✨ The Zodiac Sign of Your Soulmate Revealed",
        html: wrap(
          h1("Zodiac Sign of Your Soulmate") + meta +
          p(`Your ${sign} energy creates a magnetic polarity with a very specific zodiac signature — one that both challenges and completes you.`) +
          h2("Their Sign") +
          p(`<strong style="font-size:22px; color:#c084fc;">Scorpio — The Soul Who Sees You</strong>`) +
          p("Scorpios carry an intensity that matches the depth you've always craved. They don't do surface-level. They want to know every layer of you, and they're willing to offer the same in return.") +
          h2("How They Love") +
          p("Fiercely loyal, emotionally brave, transformatively honest. In love, a Scorpio gives everything or nothing at all.") +
          h2("Your Compatibility") +
          p(`As a ${sign} with ${element} energy, their depth creates an intuitive bond that feels both ancient and electric.`)
        ),
      };

    case "soulmate-aura":
      return {
        subject: "✨ The Aura of Your Soulmate Revealed",
        html: wrap(
          h1("Aura of Your Soulmate") + meta +
          p(`The energetic field surrounding the soul drawn to your ${sign} and ${element} energy is unusually clear.`) +
          h2("Dominant Aura Color") +
          p(`<strong style="color:#c084fc;">Deep Violet</strong> — the color of spiritual depth, psychic sensitivity, and profound empathy.`) +
          h2("Secondary Layer") +
          p(`<strong style="color:#f0c050;">Golden White</strong> — a healing frequency suggesting this person carries a nurturing, protective energy in relationships.`) +
          h2("What This Means for You") +
          p(`Your ${element} energy and their violet-gold aura create a complementary field — you balance each other's intensity and ground each other's gifts. When you meet, you will feel an unusual calm wash over you. Pay attention to that feeling.`)
        ),
      };

    case "soulmate-personality":
      return {
        subject: "✨ The Personality of Your Soulmate Revealed",
        html: wrap(
          h1("Personality Traits of Your Soulmate") + meta +
          p(`Your ${sign} soul calls in someone who reflects exactly what you need to grow.`) +
          h2("Core Traits") +
          p("• <strong>Quietly confident</strong> — the room always notices them, even when they don't need it to") +
          p("• <strong>Deeply loyal</strong> — once they love you, their commitment is unwavering") +
          p("• <strong>Emotionally intelligent</strong> — they feel deeply and communicate it with grace") +
          p("• <strong>Curious and growth-oriented</strong> — always learning, always becoming") +
          h2("In Relationships") +
          p("They show love through presence and consistency. Steady. The kind that shows up the same on a Tuesday as they do on your birthday.") +
          h2("Their Shadow Side") +
          p(`Like all of us, they carry a shadow: a tendency toward ${element === "Water" ? "emotional withdrawal when overwhelmed" : element === "Fire" ? "impulsiveness under pressure" : element === "Air" ? "overthinking and detachment" : "stubbornness when their foundations feel threatened"}. You are exactly the right soul to help them through it.`)
        ),
      };

    case "soulmate-spiritual":
      return {
        subject: "✨ The Spiritual Alignment of Your Soulmate Revealed",
        html: wrap(
          h1("Spiritual Alignment of Your Soulmate") + meta +
          p(`Spiritual compatibility is the thread that holds love together through every storm. Your ${element} energy calls in someone whose spiritual nature is deeply aligned with your own.`) +
          h2("Their Spiritual Path") +
          p("They are a seeker — not in the restless way, but in the quiet, devoted way. They find the sacred in ordinary moments: morning light, the feeling after rain, a conversation that changes you.") +
          h2("Their Core Beliefs") +
          p("They believe in the interconnectedness of all things, in the wisdom of the body, and in healing the past before rushing into the future.") +
          h2("Your Shared Path") +
          p(`Together your paths point toward ${element === "Water" ? "deep emotional healing and intuitive awakening" : element === "Earth" ? "grounded manifestation and sacred home-building" : element === "Fire" ? "inspired action and co-creating meaningful change" : "intellectual exploration and spiritual expansion"}.`)
        ),
      };

    case "soulmate-spirit-animal":
      return {
        subject: "✨ The Spirit Animal of Your Soulmate Revealed",
        html: wrap(
          h1("Spirit Animal of Your Soulmate") + meta +
          p("Every soul is guided by an animal archetype. The spirit animal of the one meant for you has emerged clearly.") +
          h2("Their Spirit Animal") +
          p(`<strong style="font-size:20px; color:#c084fc;">The Wolf</strong>`) +
          p("The wolf represents loyalty, intuition, deep intelligence, and the rare ability to be both a fierce individual and a devoted partner. They are guided by instinct and move with purpose.") +
          h2("How They Love") +
          p("Like the wolf, your soulmate chooses carefully — but once you're in their circle, you're protected and never alone.") +
          h2("The Totem Message") +
          p(`<em>"Trust the journey. The path may be winding, but every step has been guided."</em>`)
        ),
      };

    case "soulmate-career":
      return {
        subject: "✨ The Career of Your Soulmate Revealed",
        html: wrap(
          h1("Job & Career of Your Soulmate") + meta +
          p(`How someone spends their working hours reveals their values. Your ${sign} soulmate's career is a direct expression of their soul.`) +
          h2("Their Field") +
          p(`They work in ${element === "Water" ? "counseling, the arts, or holistic health" : element === "Earth" ? "architecture, sustainability, or wellness" : element === "Fire" ? "entrepreneurship, leadership, or advocacy" : "education, technology, or writing"} — a field where their work genuinely matters.`) +
          h2("Their Work Style") +
          p("They are not motivated purely by money. They need to feel that what they do means something. They're the person who stays late because they care.") +
          h2("The Lifestyle You'll Share") +
          p("Their career creates a foundation of stability without rigidity. They value experiences over possessions and would choose a meaningful adventure every time.")
        ),
      };

    case "soulmate-impact":
      return {
        subject: "✨ The Mission of Your Soulmate Revealed",
        html: wrap(
          h1("Impact & Mission of Your Soulmate") + meta +
          p("Some souls come into our lives not just to love us, but to join our mission. The person drawn to you carries a purpose that weaves into your own.") +
          h2("Their Core Mission") +
          p(`They are here to <strong>${element === "Water" ? "heal emotional wounds and create safe spaces for truth" : element === "Earth" ? "build lasting systems and nurture communities" : element === "Fire" ? "ignite change and inspire others into their power" : "bridge worlds through ideas and connect people"}</strong>.`) +
          h2("Your Combined Impact") +
          p("Together you amplify each other's gifts. Where one leads, the other grounds. Where one inspires, the other builds.") +
          h2("Your Shared Legacy") +
          p("Whether through raising conscious children, creating meaningful work, or simply loving each other publicly in a world that needs more love — your union will leave something behind.")
        ),
      };

    case "soulmate-when-where":
      return {
        subject: "✨ When & Where You'll Meet Your Soulmate",
        html: wrap(
          h1("When & Where You'll Meet") + meta +
          p(`Your ${sign} chart and ${element} timing cycles have revealed a clear window and setting for your encounter.`) +
          h2("The Timing") +
          p("The alignment points toward <strong>within the next 12 months</strong>, with a charged window in the <strong>autumn months</strong> when Venus moves through your sector of deep connection.") +
          h2("The Setting") +
          p(`Most likely ${element === "Water" ? "near water — a beach, a river walk, a rainy evening" : element === "Earth" ? "in nature or a place that feels like home — a market, a garden, a quiet neighbourhood" : element === "Fire" ? "at a gathering, event, or moment of spontaneous action" : "through a shared interest, an introduction, or an idea that connects you"}.`) +
          h2("The Signs to Watch For") +
          p("In the days before your meeting: repeated encounters with 11 or 22, an unexpected feeling of calm, and a dream that stays with you into the morning.")
        ),
      };

    case "soulmate-meeting-details":
      return {
        subject: "✨ The Details of Your First Meeting Revealed",
        html: wrap(
          h1("Small Details of Your Meeting") + meta +
          p("The universe encodes its most sacred encounters in specificity. Here are the beautiful details of the moment your paths cross.") +
          h2("The First Thing You'll Notice") +
          p(`Their <strong>${answers.soul_window === "The Smile" ? "smile" : "eyes"}</strong> — before anything else is said, before a name is exchanged. Startlingly familiar.`) +
          h2("How the Conversation Begins") +
          p("Simply — almost mundanely. A comment about something nearby, a shared glance. And then, without noticing, you'll find yourself an hour deep in the most real conversation you've had in years.") +
          h2("The Detail You'll Always Remember") +
          p("The specific light of that moment, a word they use that no one else says quite that way. A small, almost cinematic detail that will live in you.") +
          p("<em>When you think back later, you'll realize: you knew. Something in you always knew.</em>")
        ),
      };

    case "soulmate-past-life":
      return {
        subject: "✨ Your Past Life Connection Revealed",
        html: wrap(
          h1("Past Life Connection with Your Soulmate") + meta +
          p(`Your ${sign} chart carries karmic imprints pointing to a soul you have loved before.`) +
          h2("Your Most Recent Past Life Together") +
          p(`In a past life you were <strong>${element === "Water" ? "artists or healers in a coastal village, bound by deep emotional devotion" : element === "Earth" ? "farmers or builders who created a home and life from nothing" : element === "Fire" ? "warriors or leaders who stood side by side through great trials" : "scholars or travelers who crossed continents in pursuit of knowledge and each other"}</strong>.`) +
          h2("The Unresolved Bond") +
          p(`Your connection was interrupted before it reached its full expression. The longing you've felt in this lifetime is the echo of that incompletion.`) +
          h2("The Gift You Carry Back") +
          p("This time, you return with all the love and none of the obstacles. The karmic debt has been paid.") +
          p("<em>When you meet again, the recognition will be immediate and wordless. A feeling of: there you are.</em>")
        ),
      };

    default:
      return {
        subject: `✨ Your PerfectLove Reading is Ready`,
        html: wrap(
          h1("Your Cosmic Reading") + meta +
          p(`Your personalized ${reading_id.replace(/-/g, " ")} reading has been crafted based on your ${sign} energy and ${element} resonance.`) +
          p("The insights within are specific to your cosmic profile — read slowly, and trust what resonates.")
        ),
      };
  }
}

// ── Cron handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: orders, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("status", "processing")
    .lte("delivery_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let delivered = 0;

  for (const order of orders ?? []) {
    try {
      let image_url: string | null = null;
      if (order.reading_id === "soulmate-sketch") {
        image_url = await generateSoulmateSketch(order.answers);
      }

      const { subject, html } = buildEmail({ ...order, image_url });

      await resend.emails.send({
        from: "PerfectLove <readings@perfectlove.app>",
        to: order.email,
        subject,
        html,
      });

      await getSupabase()
        .from("orders")
        .update({ status: "delivered", image_url })
        .eq("id", order.id);

      delivered++;
    } catch {
      // Continue processing remaining orders
    }
  }

  return NextResponse.json({ delivered });
}
