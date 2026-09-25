# Research notebooks

Notebooks behind the **Degree of Discrepancy (DoD)** study: a text-embedding measure of how far employee reviews drift from the vision a company's management states.

## Research question

TODO: one or two sentences in your own words.

## Notebooks

| Notebook | What it does |
|---|---|
| `final_project2.ipynb` | Main analysis. Embeds management vision statements (2015, 2021) and employee reviews (pros + cons) per firm and year, computes DoD, and relates the 2015 to 2021 change to review scores. Experiment 2 repeats it on a second firm list and splits firms by the sign of the DoD change. |
| `final_project.ipynb` | Exploratory analysis of the review text. Classifies firms by industry, filters to Information Technology, embeds pros and cons, then clusters them and labels the clusters. |

Suggested order: `final_project.ipynb` for the data exploration, then `final_project2.ipynb` for the measure.

## Method

1. **Data**: Glassdoor job reviews (`glassdoor_reviews.csv`), management vision statements collected per firm for 2015 and 2021. TODO: dataset source and how the vision statements were collected.
2. **Industry filter**: Gemini (`gemini-2.5-flash`) assigns each firm an industry; the analysis keeps Information Technology.
3. **Preprocessing**: firm names are stripped from the review text; reviews from interns, apprentices and trainees are excluded; long vision statements are summarized with Gemini before embedding.
4. **Embedding**: `sentence-transformers/all-MiniLM-L6-v2` for the DoD measure; `CultureBERT/roberta-large-dominant-culture` (reviews capped at 128 tokens) for the cluster analysis.
5. **Clustering** (`final_project.ipynb`): PCA (50 components), then UMAP, then HDBSCAN.
6. **DoD** (`final_project2.ipynb`): `DoD = 1 - cosine_similarity(vision_embedding, review_embedding)`, per firm and year. The transition is `DoD(2021) - DoD(2015)`, compared with the same transition in `overall_rating`, `recommend` and `culture_values`.

## Results

TODO: two or three findings you can defend, with the firm count and a figure.

## Running the notebooks

They were written for Google Colab.

- Python 3.12; each notebook installs its own dependencies in the first cell (`sentence-transformers`, `umap-learn`, `hdbscan`, `scikit-learn`, `transformers`, `nltk`).
- Data is read from Google Drive (`WORK_DIR`). **The datasets are not included in this repository**, so update the paths after downloading them.
- Set `GEMINI_API_KEY` in Colab Secrets. Cells that call Gemini are commented out where the results were saved to CSV and reloaded.
- The clustering cells expect a GPU runtime.

## Limitations

TODO: for example the number of firms, review sampling bias, and that similarity of short summaries is only a proxy for alignment.
