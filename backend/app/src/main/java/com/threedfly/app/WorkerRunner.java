package com.threedfly.app;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Placeholder for the worker loop. Once the job-queue plumbing lands in
 * modules/common, this becomes the consumer bootstrap; until then it only
 * marks that the process started in worker mode.
 */
@Component
@Profile("worker")
public class WorkerRunner implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("3DFly worker mode: queue consumers will start here.");
    }
}
