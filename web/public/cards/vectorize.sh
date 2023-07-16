#!/bin/bash
for i in {1..280}
do
  curl https://vectorizer.ai/api/v1/vectorize \
   -u 'vk24n3ryl3llskp:buu81jt4n2nvip2ac3ahq40bnga25tpjf2hthudgvv8jfcj9le5f' \
   -F image=@card-$i.jpg \
   -o "card-$i.svg"
done
