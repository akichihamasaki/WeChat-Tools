package jldp.portal.core.base.test;

import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import jldp.portal.framework.FwApplication;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes=FwApplication.class)
@WebAppConfiguration
@ActiveProfiles("junit")
public class BaseTestCase extends MockMvcResultMatchers{

}
