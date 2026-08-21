(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.IdentitySignalEngine=api;
})(typeof window!=='undefined'?window:null,function(){
  const signalProfiles={
    "Refined + unexpected": {
      name:"Controlled Distinction",
      principle:"Keep the refinement. Interrupt the predictability.",
      effects:["Clarity","Individuality","Restraint"], aversions:["Too safe","Too trendy","Too obvious"], decisions:["The more distinctive one","The more timeless one","The one that feels more like me"],
      translations:["STYLE|Use a clean base, then add one detail that could not have been chosen by autopilot.","SPACE|Let the room read as composed first; make one object, texture, or color decisively personal."],
      moves:{Style:"Keep the silhouette legible, then make one proportion, material, or accessory choice unmistakably specific.",Beauty:"Use a polished base and let one element—lip, liner, nail, hair detail, or scent—carry the surprise.",Space:"Create visual order first, then give one object, texture, or color enough character to break predictability.",Presence:"Lead with clarity and composure, then introduce one point of view people could only reasonably attribute to you.",Life:"Keep the routine efficient, but protect one ritual or object that makes the day feel authored rather than generic."}
    },
    "Soft + structured": {
      name:"Soft Authority",
      principle:"Keep the structure. Remove the stiffness.",
      effects:["Authority","Warmth","Clarity"], aversions:["Too severe","Too casual","Too performative"], decisions:["The one with better quality","The more timeless one","The one that feels more like me"],
      translations:["STYLE|Pair clear shape with a tactile or fluid element instead of building authority from rigidity alone.","SPACE|Use visual order and defined forms, then soften them with material, light, or touch."],
      moves:{Style:"Choose one decisive shape and one softening element; authority does not need a head-to-toe uniform.",Beauty:"Keep grooming intentional and defined, then use skin finish, hair movement, or color to prevent severity.",Space:"Use clean organization and defined forms, then soften them with warm light, texture, or curved edges.",Presence:"State the point clearly, then leave room for warmth; firmness and approachability can coexist.",Life:"Create dependable structure around the day, but build in enough ease that the system supports you instead of policing you."}
    },
    "Familiar + unusual": {
      name:"Recognizable Difference",
      principle:"Start with what reads clearly. Change one expectation.",
      effects:["Individuality","Ease","Clarity"], aversions:["Too obvious","Too trendy","Too safe"], decisions:["The more distinctive one","The one that feels more like me","The one I’ll actually use"],
      translations:["STYLE|Choose a known silhouette and alter proportion, texture, color, or styling rather than chasing novelty everywhere.","PRESENCE|Use familiar language or format, but let one sharp point of view make it unmistakably yours."],
      moves:{Style:"Use a silhouette you already trust, then alter one expectation through color, scale, texture, or styling.",Beauty:"Keep the overall look readable, then make one detail unexpectedly precise, graphic, glossy, textured, or offbeat.",Space:"Anchor the room in recognizable forms, then add one piece that creates a second look.",Presence:"Use a familiar format or tone, then let one unusual observation or phrasing choice carry your signature.",Life:"Keep the useful routine; change one recurring choice so the day stops feeling copied from a default template."}
    },
    "Restrained + sensual": {
      name:"Quiet Sensuality",
      principle:"Let suggestion do more work than display.",
      effects:["Sensuality","Restraint","Mystery"], aversions:["Too obvious","Too busy","Too performative"], decisions:["The more beautiful one","The more timeless one","The one that feels more like me"],
      translations:["STYLE|Favor controlled lines, touchable materials, and selective exposure instead of obvious seduction cues.","SPACE|Build intimacy through low contrast, texture, light, and closeness rather than decorative excess."],
      moves:{Style:"Favor controlled lines and tactile material, then expose or emphasize selectively rather than everywhere.",Beauty:"Choose one intimate cue—skin finish, scent, lip, hair texture, or eye emphasis—and keep the rest restrained.",Space:"Build intimacy through light, texture, scale, and closeness rather than decorative overload.",Presence:"Say less, but make the chosen words exact; reserve can create presence when it is deliberate rather than evasive.",Life:"Create a few sensory pleasures you actually notice—fabric, light, scent, music, food—instead of multiplying decorative rituals."}
    },
    "Intellectual + playful": {
      name:"Clever Play",
      principle:"Keep the intelligence. Refuse the solemnity.",
      effects:["Intelligence","Playfulness","Individuality"], aversions:["Too performative","Too safe","Too traditional"], decisions:["The more distinctive one","The one that feels more like me","The more beautiful one"],
      translations:["STYLE|Use considered references or structure, then disrupt them with wit, color, scale, or an unexpected object.","PRESENCE|Make the idea rigorous enough to hold up, but human enough to invite people in."],
      moves:{Style:"Let the reference or structure be smart, then add wit through scale, color, styling, or an unexpected object.",Beauty:"Keep one technique precise, then let color, shape, nail detail, or hair styling add the joke or surprise.",Space:"Use books, art, objects, and arrangement as ideas, but include something that prevents the room from feeling like a thesis defense.",Presence:"Make the idea rigorous enough to survive scrutiny, then phrase or present it in a way that lets people enjoy entering it.",Life:"Choose activities that genuinely stimulate you, but leave room for delight that does not need to justify its productivity."}
    },
    "Practical + beautiful": {
      name:"Functional Beauty",
      principle:"Beauty earns its place by surviving real life.",
      effects:["Beauty","Ease","Clarity"], aversions:["Too impractical","Too busy","Too trendy"], decisions:["The one I’ll actually use","The one that makes life easier","The one with better quality"],
      translations:["STYLE|Prioritize pieces that solve a repeat problem, then demand proportion, material, and finish that still feel intentional.","LIFE|Design rituals around friction reduction, but make the tools and environment pleasurable enough to want to return to."],
      moves:{Style:"Solve the recurring wear problem first, then reject the solution if its cut, material, or finish makes you feel resigned.",Beauty:"Favor routines you can repeat consistently, then make the textures, tools, and finish pleasurable enough to keep using.",Space:"Put storage, circulation, comfort, and cleaning reality first; then make those practical choices visually coherent.",Presence:"Use the clearest format for the job, then refine wording and presentation so usefulness does not read as indifference.",Life:"Remove recurring friction, then choose tools and rituals attractive enough that the easier behavior is also the one you want."}
    },
    "Romantic + grounded": {
      name:"Grounded Romance",
      principle:"Keep the feeling. Give it weight and reality.",
      effects:["Beauty","Warmth","Sensuality"], aversions:["Too sweet","Too severe","Too impractical"], decisions:["The one I’ll actually use","The more beautiful one","The one that feels more like me"],
      translations:["STYLE|Use softness, detail, or nostalgia with grounded shoes, substantial materials, or a practical silhouette.","SPACE|Let atmosphere feel storied and tender, but anchor it with useful objects and honest materials."],
      moves:{Style:"Keep softness or detail, then anchor it with substantial material, useful pockets, grounded shoes, or a practical silhouette.",Beauty:"Use softness, glow, fragrance, or detail without requiring fragility or a high-maintenance routine to sustain the effect.",Space:"Let the room feel storied and tender, but anchor it in useful objects, comfortable seating, and materials that can be lived with.",Presence:"Keep warmth and expressive language, then ground the message in a concrete point so feeling does not become vagueness.",Life:"Protect rituals with emotional meaning, but make them feasible enough to survive an ordinary week."}
    },
    "Strong + approachable": {
      name:"Open Authority",
      principle:"Make strength legible without making distance the price of it.",
      effects:["Authority","Warmth","Clarity"], aversions:["Too severe","Too performative","Too obvious"], decisions:["The one with better quality","The one that feels more like me","The more timeless one"],
      translations:["STYLE|Use decisive shape or contrast, then temper it with ease, warmth, or tactile softness.","PRESENCE|Be clear before being forceful; warmth can support authority instead of weakening it."],
      moves:{Style:"Use decisive shape or contrast, then add ease, warmth, or tactile softness so strength does not become armor.",Beauty:"Choose one defined element and keep the overall finish alive and approachable rather than hyper-controlled.",Space:"Use strong anchors—layout, scale, contrast, or material—then add comfort and warmth where people actually interact.",Presence:"State the point early and clearly, then use tone, acknowledgment, or context to keep firmness from becoming distance.",Life:"Create standards that reduce uncertainty, but leave enough flexibility that they support relationships and real-world variation."}
    },
    "Minimal + distinctive": {
      name:"Quiet Individuality",
      principle:"Remove noise, not identity.",
      effects:["Clarity","Individuality","Restraint"], aversions:["Too busy","Too safe","Too trendy"], decisions:["The more distinctive one","The more timeless one","The one that feels more like me"],
      translations:["STYLE|Keep the number of elements low, but make proportion, material, cut, or one signature detail highly specific.","SPACE|Reduce visual clutter while preserving one or two choices with unmistakable character."],
      moves:{Style:"Reduce the number of elements, then make cut, proportion, material, or one signature detail specific enough to carry identity.",Beauty:"Keep the routine edited, but make one finish, shape, color, or scent recognizably yours.",Space:"Remove visual clutter without deleting the few objects, colors, or materials that give the room actual character.",Presence:"Use fewer words or visual elements, but make each one more exact; minimal does not mean generic.",Life:"Simplify recurring decisions, then protect the few rituals and objects that materially change how the day feels."}
    },
    "I don't know yet": {
      name:"Emerging Direction",
      principle:"Use rejection as data before forcing a label.",
      effects:[], aversions:[], decisions:[],
      translations:["STYLE|Notice what you repeatedly remove, return, or refuse. The negative pattern may be clearer than the positive one right now.","LIFE|Track the situations that feel most unlike you; mismatch is useful evidence when preference is still forming."],
      moves:{Style:"Track what you repeatedly avoid wearing or remove before leaving; rejection may be clearer than aspiration right now.",Beauty:"Notice which steps you skip, resent, or undo after trying them; those patterns are valid data.",Space:"Photograph the areas that repeatedly irritate you and name the reason before deciding what aesthetic they should become.",Presence:"Notice which situations make you over-explain, mute yourself, or perform; the mismatch can reveal the direction before a label can.",Life:"Track the recurring moments that feel most unlike you; start by reducing one source of mismatch instead of inventing a total reinvention."}
    }
  };

  const domainMap={
    "Clothes / personal style":"Style",
    "Beauty / grooming":"Beauty",
    "Home / surroundings":"Space",
    "Public presence / communication":"Presence",
    "Daily life / rituals":"Life",
    "Several of these":"Cross-domain",
    "I’m not sure—I just know something feels off":"Cross-domain"
  };

  function alignedCount(selected, allowed){
    return selected.reduce((n,item)=>n+(allowed.includes(item)?1:0),0);
  }

  function infer(answers){
    const tension=answers.tension?.[0]||"I don't know yet";
    const effect=answers.effect||[];
    const aversion=answers.aversion||[];
    const decision=answers.decision?.[0]||"";
    const mismatch=answers.mismatch?.[0]||"";
    const focus=domainMap[mismatch]||"Cross-domain";

    // No single answer is the classifier. Each named signal competes on four
    // independent evidence families; productive tension is weighted, but it can
    // be outweighed by the broader pattern in effects, aversions, and decisions.
    const candidates=Object.entries(signalProfiles)
      .filter(([key])=>key!=="I don't know yet")
      .map(([key,profile])=>{
        const effectHits=alignedCount(effect,profile.effects||[]);
        const aversionHits=alignedCount(aversion,profile.aversions||[]);
        const decisionHit=(profile.decisions||[]).includes(decision)?1:0;
        const tensionHit=tension===key?1:0;
        const score=effectHits+aversionHits+decisionHit+(tensionHit*2);
        const alignedFamilies=[effectHits>0,aversionHits>0,decisionHit>0,tensionHit>0].filter(Boolean).length;
        return {key,profile,score,alignedFamilies,effectHits,aversionHits,decisionHit,tensionHit};
      })
      .sort((a,b)=>b.score-a.score || b.alignedFamilies-a.alignedFamilies || a.key.localeCompare(b.key));

    const winner=candidates[0];
    const runnerUp=candidates[1];
    const useFallback=!winner || winner.score<2;
    const chosen=useFallback
      ? {key:"I don't know yet",profile:signalProfiles["I don't know yet"],score:0,alignedFamilies:0,effectHits:0,aversionHits:0,decisionHit:0,tensionHit:0}
      : winner;
    const base=chosen.profile;
    const margin=useFallback ? 0 : Math.max(0,chosen.score-(runnerUp?.score||0));
    const tensionConflict=!useFallback && tension!=="I don't know yet" && chosen.key!==tension;

    let strength="Emerging";
    if(!useFallback && chosen.score>=5 && margin>=2 && chosen.alignedFamilies>=3) strength="Strong";
    else if(!useFallback && chosen.score>=3 && margin>=1 && chosen.alignedFamilies>=2) strength="Moderate";

    const strengthCopy=strength==="Strong"
      ?(tensionConflict
        ?"Several independent answers reinforce this direction even though your selected tension points elsewhere."
        :"Several independent answers reinforce the same direction.")
      :strength==="Moderate"
        ?(tensionConflict
          ?"Several answers converge here, but another evidence family points elsewhere, so we treat the pattern as provisional."
          :"Several answers point the same way, but this short intake does not test enough contexts to know if the pattern holds consistently.")
        :"Your answers point in more than one useful direction. We’re showing the strongest current pattern rather than forcing them into one category.";

    const evidence=[];
    if(effect.length) evidence.push(`You want your presence to communicate ${effect.map(x=>x.toLowerCase()).join(" and ")}.`);
    if(aversion.length) evidence.push(`You reject choices that feel ${aversion.map(x=>x.replace(/^Too /,"too ").toLowerCase()).join(" or ")}.`);
    if(chosen.tensionHit) evidence.push(`You chose “${tension}” as the tension that feels most compelling.`);
    else if(decision && chosen.decisionHit) evidence.push(`When two options both work, you said ${decision.charAt(0).toLowerCase()+decision.slice(1)}.`);
    else if(tensionConflict) evidence.push(`Your “${tension}” tension choice points in another direction, so this result is based on the broader pattern rather than that answer alone.`);
    else if(decision) evidence.push(`When two options both work, you said ${decision.charAt(0).toLowerCase()+decision.slice(1)}.`);

    const focusMove=focus==="Cross-domain"
      ?"Because you named a broader mismatch, test this principle in one small decision in two different domains and see whether the same rule still helps."
      :(base.moves?.[focus]||"Use the governing principle in the area you said feels most mismatched, then check whether it actually reduces friction before generalizing it.");

    return {
      name:base.name,
      principle:base.principle,
      translations:base.translations,
      strength,
      strengthCopy,
      evidence:evidence.slice(0,3),
      focus,
      focusMove,
      inputs:{effect,aversion,tension,mismatch,decision},
      reasoning:{
        score:chosen.score,
        margin,
        alignedFamilies:chosen.alignedFamilies,
        effectHits:chosen.effectHits,
        aversionHits:chosen.aversionHits,
        decisionHit:chosen.decisionHit,
        tensionHit:chosen.tensionHit,
        tensionConflict,
        selectedSignalKey:chosen.key,
        candidateScores:Object.fromEntries(candidates.map(c=>[c.key,c.score]))
      }
    };
  }

  return {infer,signalProfiles};
});
