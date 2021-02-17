<template>
  <div>
    <b-container class="mt-5 things">
      <ul>
        <li class="place">
          <h2 class="place-header">The National Ranching Heritage Center</h2>
          <img src="@/static/nrhc.jpg" alt="" class="place-image" />
          <p class="place-info">
            The National Ranching Heritage Center, or the NRHC, spans an
            impressive 16 acres and has an amazing 48 buildings on it, some of
            which date back to the 18th century. The NRHC has been lovingly
            preserved and can be visited throughout the year, when guests here
            can take a tour of the center and learn how life would have been in
            days gone by for the ranchers who lived and worked here. There are
            also events held throughout the year, including during holiday
            season such as Candlelight at the Ranch in December, so make sure
            you check what’s on when you are in town.
          </p>
        </li>
        <li class="place">
          <h2 class="place-header">Buddy Holly Center</h2>
          <img src="@/static/buddyhollycenter.jpg" alt="" class="place-image" />
          <p class="place-info">
            One of Lubbock’s most famous sons is the musical genius Buddy Holly,
            and with that in mind visitors should head to the Buddy Holly Center
            in the Depot Entertainment District of the city, itself also
            something of a cultural landmark. The center features a static
            exhibit that will tell you all about Buddy Holly’s life and
            impressive musical career, and you will find period artifacts that
            belonged to the musician as well as anecdotes and other antique
            memorabilia. Part of the center is also the Allison House which was
            the childhood house of Jerry Ivan Allison who was a drummer for
            Buddy Holly’s band The Crickets, and who collaborated with Holly
            over the years to write some of their greatest hits. The house is
            much as the Allison family left it, and there are antiques that will
            give guests a unique glimpse into this special time in the history
            of the house.
          </p>
        </li>
        <li class="place">
          <h2 class="place-header">Silent Wings Museum</h2>
          <img
            src="@/static/silentwingsmuseum.jpg"
            alt=""
            class="place-image"
          />
          <p class="place-info">
            Many people won’t know that Lubbock was once a training ground for
            glider pilots during the Second World War, and with that in mind the
            Silent Wings Museum is now dedicated to their memory. The museum
            offers a fascinating insight into the men who served their country
            as American Glider Pilots, and will tell visitors the history of the
            Glider Program through a series of engaging exhibits. There is a
            C-47 plane on display as well as a theater and a Second World War
            antique glider which has been lovingly restored.
          </p>
        </li>
        <li class="place">
          <h2 class="place-header">Caprock Winery</h2>
          <img src="@/static/caprockwinery.jpg" alt="" class="place-image" />
          <p class="place-info">
            Nestled just outside of the center of Lubbock is the Caprock Winery
            which is known primarily for its gorgeous architecture and stunning
            vineyards. The wines here are a range of both red and white
            varieties, and as the winery has been here since the early 1990s,
            they certainly know what they are doing when it comes to wine
            production. You can come here and visit the tasting rooms to sample
            the latest blends and pick up a bottle or two to take home with you
            as a souvenir of your trip.
          </p>
        </li>
      </ul>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "things-to-do",
};
</script>

<style lang="scss">
.things {
  @media screen and (min-width: 720px) {
    ul {
      padding: 0 10rem;
    }
  }
  @media screen and (max-width: 720px) {
    ul {
      padding-left: 0;
    }
  }
  .place {
    list-style-type: none;
    margin-bottom: 2rem;
  }
  .place-header {
  }
  .place-info {
  }
  .place-image {
    width: 100%;
    margin: 1rem 0;
  }
}
</style>