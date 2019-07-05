<template>
  <div class="q-pr-md">
    <h4 class="text-weight-light no-margin q-py-md text-center">About Databrary</h4>

    <div class="text-h5 text-primary text-weight-normal q-pt-md">Overview</div>
    <div class="entry-content col_with_nav">
      <p>
        Databrary is a web-based data library for developmental scientists to securely store,
        manage, share, discover, and reuse research data, including videos, audio files,procedures
        and stimuli, and related metadata. Databrary provides a secure and permanent repository for
        research data, backed by the resources of New York University's IT Department. In addition,
        Databrary has implemented a rigorous policy framework designed to permit the sharing and
        re-use of research data containing personally identifying information, with participant
        consent, in an ethical and efficient way. With a Databrary Access Agreement signed by their
        institution, researchers can re-use other scientists' data, improving reliability and
        transparency, and making data collection more cost effective. Researchers can also find
        illustrative video clips to use for teaching and conference presentations. Because
        Databrary provides persistent identifiers (DOIs) to shared datasets, researchers gain
        citation credit for their work. While there are other data repositories, Databrary is
        unique in allowing both uploading of research data as well as access to multiple datasets
        containing personally identifying information with one access agreement.
      </p>
      <p>
        Databrary is specialized for the sharing of video data. Video (and audio) recordings may
        contain information about research participants or other individuals who are incidentally
        recorded. Images and/or voices may be visible or heard and names may be spoken out loud.
        If a study takes place in a home or other setting, aspects of that home or setting may be
        recorded. Thus, individuals or locations may be identified from recordings. In addition,
        metadata (e.g. child's birthdate) may contain identifiable information.
      </p>
      <p>
        Databrary's policy framework, requiring participant consent, institutional approval, and
        ethics board oversight (see table below), creates a secure and ethical infrastructure for
        the sharing and re-use of research data containing personally identifying information.
        First, research data may only be shared on Databrary with explicit informed consent from
        each participant. Second, for researchers to gain access to Databrary's shared resources,
        their institution must execute a Databrary Access Agreement stipulating that the
        researcher: (a) belongs to an institution that maintains an ethics or Institutional Review
        Board with U.S.-equivalent standards that reviews and approves research involving human
        subjects; (b) has current research ethics training that addresses human subjects policy
        and issues; and (c) is eligible to conduct independent research at the institution. Third,
        investigators authorized to use Databrary agree to follow
        <a
          href="https://www.databrary.org/resources/policies/responsibilities/investigators.html"
        >strict policies designed to protect participant confidentiality
        </a>
        , and must: (1) secure IRB/ethics board approval to ask participants for permission to
        share video on Databrary; (2) protect the identity of all individuals with information in
        Databrary, especially depicted individuals; (3) keep data secure on computers with limited
        access; (4) ensure that researchers in their lab who access data have applied for and been
        granted authorization to access Databrary; (5) respect the Release Level consented to by
        depicted individuals on shared data; (6) use resources from Databrary exclusively for the
        purpose of scientific research or education under the auspices of either an academic,
        research, government, health, or a commercial entity (but in the last case, solely for
        non-commercial purposes); and (7) cite all Databrary resources they use in their
        scholarly work.
      </p>
      <p>
        This framework ensures maximal protection of participant confidentiality while simultaneous
        permitting data sharing amongst a community of scholars
      </p>
      <q-markup-table dense flat bordered>
        <thead>
          <tr>
            <th>I’m using Databrary to…</th>
            <th>IRB/Ethics Board Permission Required?</th>
            <th>Participant Permission Level Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>…browse others’ research.</td>
            <td>No</td>
            <td>
              <img class="aboutDatabraryImg"  src="https://nyu.databrary.org/web/icons/release/shared.svg">
              <span>Authorized Users</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/excerpts.svg" />
              <span>Learning Audiences</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/public.svg">
              <span>Public</span>
            </td>
          </tr>
          <tr>
            <td>…find clips for teaching or talks.</td>
            <td>No</td>
            <td>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/excerpts.svg">
              <span>Learning Audiences</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/public.svg">
              <span>Public</span>
            </td>
          </tr>
          <tr>
            <td>
              …store my own research data (e.g., video or audio files, survey results, assessments).
            </td>
            <td>Sometimes – Institution Specific, Check with your IRB</td>
            <td>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/private.svg">
              <span>Private</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/shared.svg">
              <span>Authorized Users</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/excerpts.svg">
              <span>Learning Audiences</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/public.svg">
              <span>Public</span>
            </td>
          </tr>
          <tr>
            <td>…store my materials (e.g., stimuli, procedural videos).</td>
            <td>No</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td>…re-use other researchers’ data shared on Databrary.</td>
            <td>Always</td>
            <td>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/shared.svg">
              <span>Authorized Users</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/excerpts.svg">
              <span>Learning Audiences</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/public.svg">
              <span>Public</span>
            </td>
          </tr>
          <tr>
            <td>…share my own data on Databrary.</td>
            <td>Always</td>
            <td>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/shared.svg">
              <span>Authorized Users</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/excerpts.svg">
              <span>Learning Audiences</span>
              <br>
              <img class="aboutDatabraryImg" src="https://nyu.databrary.org/web/icons/release/public.svg">
              <span>Public</span>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.aboutDatabraryImg {
  width: 25px;
}
</style>
