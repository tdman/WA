package aws.community.examples.bedrock.util;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class TestUtil {

    private static final Logger log = LoggerFactory.getLogger(TestUtil.class);

    public static JSONObject readInfo (String file) {
        String cont = "";

        try {
            Resource resource = new ClassPathResource(file);
            cont = readIs(resource.getInputStream());
        } catch (Exception e) {
            log.error(" ### TestUtil.readFile ### ", e);
        }

        return mkResponse(cont);
    }

    public static JSONObject readProbsInfo (String file, int probCnt) {
        JSONObject json = readInfo(file);
        JSONArray ja = json.getJSONArray("data");

        if (ja.length() > probCnt) {
            JSONArray ja2 = new JSONArray();
            for (int i = 0; i < probCnt; i++) {
                ja2.put(ja.get(i));
            }
            json.put("data", ja2);
        }

        return json;
    }

    public static JSONObject readProbsInfoS3 (InputStream is, int probCnt) {
        JSONObject json = mkResponse(readIs(is));
        JSONArray ja = json.getJSONArray("data");

        if (ja.length() > probCnt) {
            JSONArray ja2 = new JSONArray();
            for (int i = 0; i < probCnt; i++) {
                ja2.put(ja.get(i));
            }
            json.put("data", ja2);
        }

        return json;
    }

    public static String readIs (InputStream is) {
        try {
            StringBuilder cont = new StringBuilder();
            BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            String ln;
            while ((ln = br.readLine()) != null) {
                cont.append(ln);
            }
            return cont.toString();
        } catch (Exception e) {
            log.error(" ### TestUtil.readIs ### ", e);
            return "";
        }
    }

    public static JSONObject mkResponse (String cont) {
        JSONObject json = new JSONObject();
        JSONArray ja = new JSONArray();
        try {
            json = new JSONObject(cont);
            json.put("data", new JSONArray().put(json));
        } catch (org.json.JSONException e) {
            ja = new JSONArray(cont);
            json.put("data", ja);
            //log.error(" ### TestUtil.readInfo ### ", e);
        }

        return json;
    }
}
