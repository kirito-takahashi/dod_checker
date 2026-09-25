# Research notebooks

Notebooks behind the undergraduate thesis *Quantifying the Semantic Gap between Corporate Visions and Employee Perceptions* (2025). The thesis introduces the **Degree of Discrepancy (DoD)**, a sentence-embedding measure of how far employee reviews sit from the vision that management states.

## Research questions

- **RQ1.** To what extent can semantic similarities derived from sentence transformers quantify the Degree of Discrepancy (DoD) between executive visions and employee reviews?
- **RQ2.** To what extent can this metric capture longitudinal shifts in DoD?

Following Schein's three-level model of culture, the study looks only at the two layers that show up in language: espoused values (vision statements) and artifacts (what employees write about daily work). Basic assumptions are out of scope.

## Notebooks

| Notebook | What it does |
|---|---|
| `final_project2.ipynb` | The thesis analysis. Embeds vision statements (2015, 2021) and employee reviews per firm and year, computes DoD, and relates the 2015 to 2021 change to review scores. Experiment 1 is a pilot on 7 firms; Experiment 2 is the 23-firm analysis reported in the thesis, including the split by the sign of the DoD change. |
| `final_project.ipynb` | Exploratory work that is not part of the thesis results. Classifies firms by industry, filters to Information Technology, then clusters review text (pros and cons) and labels the clusters. |

## Data

- **Employee reviews**: [Glassdoor Job Reviews](https://www.kaggle.com/datasets/davidgauthier/glassdoor-job-reviews-2) by David Gauthier (2024), UK companies, 838,566 reviews. Columns used: `firm`, `overall_rating`, `culture_values`, `recommend`, `pros`, `cons`.
- **Vision statements**: collected by hand from annual reports and proxy filings for the 23 UK-based IT firms, for 2015 and 2021, then summarized with `gemini-2.5-flash` to strip procedural text before embedding.

The datasets are not included in this repository.

## Method

1. Drop rows with missing critical fields, concatenate `pros` and `cons` into one review text, and map `recommend` to numeric values.
2. Embed reviews and summarized vision statements with `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions).
3. `DoD = 1 - cosine_similarity(vision_embedding, review_embedding)`, computed per firm and year.
4. For each firm, take the change from 2015 to 2021 in DoD, `overall_rating`, `recommend` and `culture_values` (`dod_change`, `rate_change`, `rec_change`, `cval_change`), then correlate them.
5. Repeat the correlation on the firms whose `dod_change` is positive, meaning the gap widened.

## Results

- **All 23 firms**: `dod_change` is only weakly related to the conventional metrics (r = 0.23 with `rate_change`, 0.12 with `rec_change`, 0.11 with `cval_change`).
- **The 11 firms whose gap widened**: the relationship turns negative and stronger (r = -0.58 with `rate_change`, -0.45 with `rec_change`, -0.60 with `cval_change`). A larger increase in DoD goes with a smaller improvement in employee evaluations.
- **Reading**: DoD is a conditional, exploratory signal of executive-employee misalignment, not a general measure of organizational culture.

The thesis reports correlation coefficients only; no significance test is reported.

## Limitations

- UK Information Technology firms only, so the findings may not generalize to other industries or countries.
- The stratified result rests on 11 firms.
- Glassdoor reviews are self-selected and may overrepresent extreme or dissatisfied voices.
- LLM summarization of vision statements adds a layer of abstraction that can shift the embeddings.
- Sentence embeddings capture linguistic similarity, not non-linguistic aspects of culture or deeper assumptions.

## Running the notebooks

They were written for Google Colab.

- Python 3.12. Each notebook installs its own dependencies in the first cell (`sentence-transformers`, `umap-learn`, `hdbscan`, `scikit-learn`, `transformers`, `nltk`).
- Data is read from Google Drive (`WORK_DIR`). Update the paths after downloading the datasets.
- Set `GEMINI_API_KEY` in Colab Secrets. Cells that call Gemini are commented out where the results were saved to CSV and reloaded.
- The clustering cells in `final_project.ipynb` expect a GPU runtime.
