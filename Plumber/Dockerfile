FROM rstudio/plumber:latest

#create imgs folder.
RUN mkdir /var/media
RUN mkdir /var/media/graph_imgs

RUN Rscript -e 'remotes::install_version("tidyverse",upgrade="never", version = "1.3.2")'