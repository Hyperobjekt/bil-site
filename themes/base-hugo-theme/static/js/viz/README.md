# README for eCharts BIL Vizualization

I have defined several items in the data directory in case we want to add CMS editing later.

* ./data/viz/parentNodes.yml
  * List of all parent nodes ("topics")
  * Will not be displayed if binary `display` is set to 0
* ./data/viz/childNodes.yml
  * List of all child nodes ("subtopics")
  * Child nodes must have a parent set, use the parent `id` attribute
  * Will not be displayed if binary `display` is set to 0
* ./data/viz/links.yml
  * List of all links
  * Includes links from the root node, `id` of `root`, to the topics
  * Add each link here, using the `id` of the parent and the child as source and target
  * Use the same format to add links between topics or between subtopics
