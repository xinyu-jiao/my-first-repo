**2.1 Historical backdrop**

- **Fairness-in-ML moment (2017-2020).**  Widespread concern about search and recommendation systems amplifying social inequities was crystalizing in the run-up to 2020, spurred by studies such as *Gender Shades* and policy conversations around algorithmic discrimination. The AIES 2020 paper “Diversity and Inclusion Metrics in Subset Selection” formalized new quantitative tools just as that debate peaked. 
- **Inside Google Ethical AI.**  Several paper authors (Meg Mitchell, Timnit Gebru, Alex Hanna, Dylan Baker) belonged to Google’s Ethical AI team, which was disbanded in late 2020 after internal conflict over a critical LLM paper, highlighting the real-world stakes of the fairness discussion. 
- **Project launch—March 2021.**  The explorable went live in March 2021, crediting those Ethical AI researchers even though two had just been fired ([Reuters](https://www.reuters.com/article/business/top-ai-ethics-researcher-says-google-fired-her-company-denies-it-idUSKBN28E07S/) [Reuters](https://www.reuters.com/technology/google-fires-second-ai-ethics-leader-dispute-over-research-diversity-grows-2021-02-20/))—an implicit commentary on institutional resistance to accountability. 

**2.2 Author motivations & research questions**

| Prompt                                               | Evidence                                                     | Interpretation                                               |
| ---------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Quantify representation gaps in subset selection** | The AIES paper introduces metrics that “prioritize that as many identity characteristics as possible be represented in a subset, subject to a target distribution.” | Authors seek practical levers beyond abstract fairness definitions, focusing on ranking & recommendation pipelines |
| **Bridge theory and practice via interactive media** | The explorable says “Using the careful quantification outlined in a recent paper, we can quantify biases and push these systems to return a wider range of results.” | Turning dense math into hands-on demos lowers the barrier for engineers, educators, and the public |
| **Expose hidden design choices**                     | Podcast guest Dylan Baker explains that classification schemes “are never neutral … they propagate world-views” and references an image-classification example built for the explorable | The project invites users to see how metric selection (mean vs max, intersectional targets, etc.) encodes values |

**2.3 Socio-technical context addressed**

1. **Legacy bias in search results.**  The explorable’s opening example—Google Images for “CEO” returning mostly white men—echoed journalistic critiques circulating since 2016.
2. **Rise of inclusion as distinct from diversity.**  The paper argues that “diversity is being invited to the party; inclusion is being asked to dance,” signaling a shift from mere head-counts to user-centric representational quality. 
3. **Knowledge-equity activism.**  The podcast situates the work within broader efforts to “interrogate the politics of knowledge production,” linking dataset curation to epistemic power. 

**2.4 Intended audiences**

| Audience                             | Design cues                                            | Expected takeaway                                            |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| **ML practitioners & product teams** | Code-linked Colab, metric formulas, adjustable sliders | Adopt concrete metrics when building search/recommendation pipelines |
| **Educators & students**             | Abstract-shape mode for low-stakes experimentation     | Use as a teaching module on fairness trade-offs              |
| **Wider public & advocacy groups**   | Real-image examples (doctors, CEOs) and narrative text | Understand how algorithmic outputs shape social perception and demand accountability |

**2.5 Contextual synthesis**

The *Measuring Diversity* explorable emerged at a flash-point when empirical evidence of algorithmic bias, internal industry whistle-blowing, and academic theorising converged. By merging rigorous AIES-level metrics with an accessible, interactive narrative, the authors responded to a dual challenge: **(a)** give technologists concrete tools to diagnose bias, and **(b)** empower broader audiences to question the silent values embedded in ranking systems. The result is both a pedagogical artifact and a subtle critique of the very institutions that commissioned it.